package br.com.horizon.horizon.model.dto;

import br.com.horizon.horizon.model.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CarroSemReservaDTO implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    private Long id;
    private String marca;
    private String modelo;
    private BigDecimal valorDiario;

    private String cor;

    @JsonIgnore
    private String placa;

    @JsonIgnore
    private String renavam;

    private String descricao;

    @JsonIgnore
    private Set<Reserva> reserva;

    @JsonIgnore
    private String chassi;

    @JsonIgnore
    private Categoria categoria;

    private List<Caracteristicas> caracteristica;

    private Boolean ativo;


    private List<ImagensCarro> imagensCarro;

    private Cidade cidade;
}
