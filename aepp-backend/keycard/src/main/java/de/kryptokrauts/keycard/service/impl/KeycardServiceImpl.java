package de.kryptokrauts.keycard.service.impl;

import de.kryptokrauts.keycard.service.KeycardService;
import im.status.keycard.applet.KeycardCommandSet;
import im.status.keycard.applet.Pairing;
import im.status.keycard.applet.RecoverableSignature;
import im.status.keycard.desktop.PCSCCardChannel;
import im.status.keycard.io.APDUException;
import im.status.keycard.io.WrongPINException;
import org.springframework.stereotype.Service;

import javax.smartcardio.Card;
import javax.smartcardio.CardException;
import javax.smartcardio.CardTerminal;
import javax.smartcardio.TerminalFactory;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.UUID;

/**
 * Created by njoshi on 14.09.2019
 */
@Service
public class KeycardServiceImpl implements KeycardService {
    @Override
    public String getPublicKey(String pin) throws NoSuchAlgorithmException, IOException, CardException, APDUException {

        KeycardCommandSet cmdSet = preparation(pin);

        byte[] hash = getHash(UUID.randomUUID().toString());
        RecoverableSignature signature = new RecoverableSignature(hash, cmdSet.sign(hash).checkOK().getData());

        StringBuilder publicKey = new StringBuilder();
        for (byte b : signature.getPublicKey()) {
            publicKey.append(String.format("%02X ", b));
        }
        return publicKey.toString().replaceAll(" ", "");
    }

    @Override
    public String getSignature(String pin, String message) throws IOException, CardException, NoSuchAlgorithmException, APDUException {
        KeycardCommandSet cmdSet = preparation(pin);

        byte[] hash = getHash(message);
        RecoverableSignature signature = new RecoverableSignature(hash, cmdSet.sign(hash).checkOK().getData());

        StringBuilder r = new StringBuilder();
        for (byte b : signature.getR()) {
            r.append(String.format("%02X ", b));
        }
        String rString = r.toString().replaceAll(" ", "");

        StringBuilder s = new StringBuilder();
        for (byte b : signature.getS()) {
            s.append(String.format("%02X ", b));
        }

        String sString = s.toString().replaceAll(" ", "");

        return rString + sString;
    }

    @Override
    public void generateKeys(String pin) throws IOException, CardException, APDUException {
        KeycardCommandSet cmdSet = preparation(pin);

        cmdSet.generateKey().checkOK();
    }

    private byte[] getHash(String message) throws NoSuchAlgorithmException {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] encodedhash = digest.digest(
                message.getBytes(StandardCharsets.UTF_8));

        return encodedhash;
    }

    private KeycardCommandSet preparation(String pin) throws IOException, CardException {
        // connection() is our CardChannel instance
        KeycardCommandSet cmdSet = new KeycardCommandSet(connection());

        // The checkOK method can be called on any APDUResponse object to confirm that the
        try {
            cmdSet.select().checkOK();
        } catch (APDUException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        /* This should be called, only once to do pairing. */
        // pairingPassword is usually provided by the user. This method throws an exception if pairing fails.
        // cmdSet.autoPair("Lr3J8fd9qovtl9oy");
        // Pairing pairing = cmdSet.getPairing();

        /*   This to be called, once the pairing is done   */
        // serializedPairing can be either the byte array or base64 string representation
        Pairing pairing = new Pairing("APKjlCBGQLWn7v7qC/Iy8qysK+awowBNkswQBmRpwHgB");
        // Sets the pairing info in the command set. This must be done before further operation is possible
        cmdSet.setPairing(pairing);

        // Before opening a secure channel, the card won’t allow sending any command. This guarantees secrecy, integrity and authenticity of the commands.
        cmdSet.autoOpenSecureChannel();

        // pin is the user PIN as a string of 6 digits
        try {
            cmdSet.verifyPIN(pin).checkAuthOK();
        } catch (WrongPINException e) {
            System.out.println("Number of remaining attempts: " + e.getRetryAttempts());
        } catch (APDUException e) {
            e.printStackTrace();
        }

        return cmdSet;
    }

    private PCSCCardChannel connection() throws CardException {
        // We create a TerminalFactory object
        TerminalFactory tf = TerminalFactory.getDefault();
        CardTerminal cardTerminal = null;

        // We search a terminal with a card inside
        for (CardTerminal t : tf.terminals().list()) {
            try {
                if (t.isCardPresent()) {
                    cardTerminal = t;
                    break;
                }
            } catch (CardException e) {
                e.printStackTrace();
            }
        }

        // If not found, we throw an exception. Of course you should decide how to handle this situation
        if (cardTerminal == null) {
            throw new RuntimeException("No terminal found");
        }

        // If a terminal is found, we connect to it
        Card apduCard = null;
        try {
            apduCard = cardTerminal.connect("*");
        } catch (CardException e) {
            e.printStackTrace();
        }

        // We create a PCSCCardChannel, which is an implementation of CardChannel and can be used with the rest of the SDK.
        return new PCSCCardChannel(apduCard.getBasicChannel());
    }



}
