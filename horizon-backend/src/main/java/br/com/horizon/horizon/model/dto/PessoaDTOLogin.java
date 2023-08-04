package br.com.horizon.horizon.model.dto;

import br.com.horizon.horizon.model.Funcao;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PessoaDTOLogin {
    @JsonIgnore
    private Long id;


    private String nome;

    @JsonIgnore
    private String cpf;

    @JsonIgnore
    private String cnpj;

    private String mail;


    private String sobrenome;

    private List<? extends GrantedAuthority> authorities;

    @JsonIgnore
    private String telefone;

}
