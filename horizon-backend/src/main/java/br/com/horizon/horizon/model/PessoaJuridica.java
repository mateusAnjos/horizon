package br.com.horizon.horizon.model;

import br.com.horizon.horizon.model.Usuario;
import com.fasterxml.jackson.annotation.JsonTypeName;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.br.CNPJ;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.OneToOne;
import java.io.Serializable;

@Entity
@DiscriminatorValue("2")
@JsonTypeName("2")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PessoaJuridica extends Pessoa implements Serializable {
    @CNPJ(message = "O CNPJ é inválido, revise as informações.")
    private String cnpj;
}
