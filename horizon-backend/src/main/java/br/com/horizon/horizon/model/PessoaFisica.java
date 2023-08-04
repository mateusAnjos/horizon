package br.com.horizon.horizon.model;


import com.fasterxml.jackson.annotation.JsonTypeName;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.br.CPF;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import java.io.Serializable;

@Entity
@DiscriminatorValue("1")
@JsonTypeName("1")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PessoaFisica extends Pessoa implements Serializable {
    @CPF(message = "O CPF é inválido, revise as informações.")
    private String cpf;
}
