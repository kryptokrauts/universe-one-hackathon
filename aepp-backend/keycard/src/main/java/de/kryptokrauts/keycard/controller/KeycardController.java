package de.kryptokrauts.keycard.controller;

import de.kryptokrauts.keycard.service.KeycardService;
import im.status.keycard.io.APDUException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.smartcardio.CardException;
import java.io.IOException;
import java.security.NoSuchAlgorithmException;

/**
 * Created by njoshi on 14.09.2019
 */
@RestController
public class KeycardController {

    @Autowired
    KeycardService keycardService;

    @GetMapping("/publicKey")
    public ResponseEntity<?> getPublicKey(@RequestParam String pin) throws CardException, NoSuchAlgorithmException, APDUException, IOException {
        String response = keycardService.getPublicKey(pin);
        response = response.substring(2);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/signature")
    public ResponseEntity<String> startKeycard(@RequestParam String pin,
                                               @RequestParam String message
    ) throws CardException, APDUException, IOException, NoSuchAlgorithmException {
        String response = keycardService.getSignature(pin, message);

        return ResponseEntity.ok(response);

    }

    @PostMapping("/generate")
    public ResponseEntity<?> generate(@RequestParam String pin) throws CardException, APDUException, IOException {
        keycardService.generateKeys(pin);

        return ResponseEntity.ok("success!");
    }

}
