package br.com.horizon.horizon.model.dto;

import br.com.horizon.horizon.model.Carro;
import br.com.horizon.horizon.model.ImagensCategoria;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serial;
import java.io.Serializable;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CategoriaSemCarroDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;


    public CategoriaSemCarroDTO(Long id) {
        this.id = id;
    }

    public CategoriaSemCarroDTO(Long id, String nome, String descricao) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
    }

    private Long id;
    private String descricao;

    @JsonIgnore
    private int qntCarros;

    private String nome;

    @JsonIgnore
    private List<ImagensCategoria> imagensCategoria;

    @JsonIgnore
    private List<Carro> carros;




}
