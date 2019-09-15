package de.kryptokrauts.keycard.service;

import im.status.keycard.io.APDUException;

import javax.smartcardio.CardException;
import java.io.IOException;
import java.security.NoSuchAlgorithmException;

/**
 * Created by njoshi on 14.09.2019
 */
public interface KeycardService {

    String getPublicKey(String pin) throws NoSuchAlgorithmException, IOException, CardException, APDUException;

    String getSignature(String pin, String message) throws IOException, CardException, NoSuchAlgorithmException, APDUException;

    void generateKeys(String pin) throws IOException, CardException, APDUException;

}
