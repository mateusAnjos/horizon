package br.com.horizon.horizon.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PessoaDTO {
    private Long id;



    private String nome;

    private String cpf;

    private String cnpj;


    private String sobrenome;

    private String telefone;

}
