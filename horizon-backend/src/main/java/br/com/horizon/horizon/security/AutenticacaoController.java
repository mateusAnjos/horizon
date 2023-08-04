package br.com.horizon.horizon.security;

import br.com.horizon.horizon.model.Pessoa;
import br.com.horizon.horizon.model.dto.TokenDTO;
import br.com.horizon.horizon.model.dto.UsuarioDTO;
import br.com.horizon.horizon.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AutenticacaoController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UsuarioRepository usuarioRepository;

    @Autowired
    TokenService tokenService;


    @PostMapping
    public ResponseEntity<TokenDTO> autenticar(@RequestBody UsuarioDTO usuarioDTO){
        try{
            UsernamePasswordAuthenticationToken loginUsusario = usuarioDTO.converter();
            Authentication authentication =  authenticationManager.authenticate(loginUsusario);
            String token = tokenService.gerarToken(authentication);
            TokenDTO tokenDTO = new TokenDTO();
            tokenDTO.setPessoa(tokenService.getPessoa());
            tokenDTO.setToken(token);
            tokenDTO.setTipo("Bearer");
            return ResponseEntity.ok(tokenDTO);
        }catch (AuthenticationException e){
            return new ResponseEntity("Erro", HttpStatus.BAD_REQUEST);
        }
    }
}
