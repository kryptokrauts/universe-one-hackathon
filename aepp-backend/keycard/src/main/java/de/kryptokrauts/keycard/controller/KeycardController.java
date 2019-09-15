package de.kryptokrauts.keycard.controller;

import de.kryptokrauts.keycard.service.KeycardService;
import im.status.keycard.io.APDUException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.smartcardio.CardException;
import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.util.Map;

/**
 * Created by njoshi on 14.09.2019
 */
@CrossOrigin(origins = "*", allowedHeaders = "*")
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

    @PostMapping("/signature")
    public ResponseEntity<String> startKeycard(@RequestBody Map<String, String> params
    ) throws CardException, APDUException, IOException, NoSuchAlgorithmException {
        String response = keycardService.getSignature(params.get("pin"), params.get("message"));

        return ResponseEntity.ok(response);

    }

    @PostMapping("/generate")
    public ResponseEntity<?> generate(@RequestBody String pin) throws CardException, APDUException, IOException {
        keycardService.generateKeys(pin);

        return ResponseEntity.ok("success!");
    }

}
