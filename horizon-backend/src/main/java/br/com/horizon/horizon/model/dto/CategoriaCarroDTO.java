package br.com.horizon.horizon.model.dto;

import br.com.horizon.horizon.model.Caracteristicas;
import br.com.horizon.horizon.model.Carro;
import br.com.horizon.horizon.model.Categoria;
import br.com.horizon.horizon.model.ImagensCategoria;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CategoriaCarroDTO {

    @JsonIgnore
    private Long id;
    private String nome;
    private String descricao;
    private int qntCarros;

    @JsonIgnore
    private List<ImagensCategoria> imagensCategoria;
    private List<CarroSemCategoriaDTO> carros;


    public int getQntCarros() {
        return this.carros.size();
    }
}
