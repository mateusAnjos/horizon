package br.com.horizon.horizon.model.dto;

import br.com.horizon.horizon.model.Condutor;
import br.com.horizon.horizon.model.Usuario;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReservaPorCarroDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;


    private Long id;

    private LocalDate retirada;

    private LocalDate entrega;

    @JsonIgnore
    private Double valorTotal;

    @JsonIgnore
    private List<CarroSemCategoriaDTO> carro;

    @JsonIgnore
    private Usuario usuario;

    @JsonIgnore
    private Condutor condutor;

    private Boolean ativo;

}
