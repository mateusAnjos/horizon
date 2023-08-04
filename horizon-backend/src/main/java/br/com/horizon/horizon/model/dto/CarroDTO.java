package br.com.horizon.horizon.model.dto;

import br.com.horizon.horizon.model.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CarroDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private Long id;
    private String marca;

    private String descricao;

    private String modelo;

    private BigDecimal valorDiario;

    private String cor;

    @JsonIgnore
    private String placa;

    @JsonIgnore
    private String renavam;

    @JsonIgnore
    private String chassi;

    @JsonIgnore
    private Set<Reserva> reserva;

    private CategoriaSemCarroDTO categoria;

    private Set<Caracteristicas> caracteristica;

    private List<ImagensCarro> imagensCarro;

    private Boolean ativo;

    private Cidade cidade;

}
