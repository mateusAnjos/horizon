package br.com.horizon.horizon.security;

import br.com.horizon.horizon.model.Funcao;
import br.com.horizon.horizon.model.Pessoa;
import br.com.horizon.horizon.model.Usuario;
import br.com.horizon.horizon.model.dto.PessoaDTOLogin;
import br.com.horizon.horizon.model.dto.UsuarioDTO;
import br.com.horizon.horizon.utils.ObjectConverterHandler;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class TokenService {

    @Value("${horizon.jwt.expiration}")
    private String expiracao;



    private PessoaDTOLogin pessoa;

    private Usuario user;

    private List<? extends GrantedAuthority> autoritie;




    @Value("${horizon.jwt.secret}")
    private String secret;
    public String gerarToken(Authentication authentication) {
        Usuario usuarioLogado = (Usuario) authentication.getPrincipal();
        List<? extends GrantedAuthority> lista = new ArrayList<>(usuarioLogado.getAuthorities());
        autoritie = lista;
        user = usuarioLogado;
        Date dataAtual = new Date();
        Date dataExpiracao = new Date(dataAtual.getTime() + Long.parseLong(this.expiracao));
        setPessoa(usuarioLogado.getPessoa());
        return Jwts.builder()
                .setIssuer("Api Horizon Rent Cars")
                .setSubject(usuarioLogado.getUsername())
                .setIssuedAt(dataAtual)
                .setExpiration(dataExpiracao)
                .signWith(SignatureAlgorithm.HS256, this.secret)
                .compact();
    }

    public boolean verificaToken(String token) {

        try{
            Jwts.parser().setSigningKey(this.secret).parseClaimsJws(token);
            return true;
        }catch (Exception e){
            return false;
        }
    }

    public void setPessoa(Pessoa pessoa){
        this.pessoa = new PessoaDTOLogin();
        this.pessoa.setMail(user.getUsername());
        this.pessoa.setAuthorities(this.autoritie);
        this.pessoa.setNome(pessoa.getNome());
        this.pessoa.setSobrenome(pessoa.getSobrenome());
    }
    public PessoaDTOLogin getPessoa(){
        return this.pessoa;
    }

    public String getUserName(String token) {
        Claims claims = Jwts.parser().setSigningKey(this.secret).parseClaimsJws(token).getBody();
        String username = claims.getSubject();
        return username;
    }

}
