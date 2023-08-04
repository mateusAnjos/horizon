package br.com.horizon.horizon.model.dto;

import br.com.horizon.horizon.model.Funcao;
import br.com.horizon.horizon.model.Pessoa;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class TokenDTO {

    private PessoaDTOLogin pessoa;


    private String token;
    private String tipo;
}
