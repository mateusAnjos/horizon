package br.com.horizon.horizon.model.dto;

import br.com.horizon.horizon.model.ImagensCategoria;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
public class CategoriaIdDTO implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;



    private Long id;
    private String descricao;
    private String nome;
    private int qntCarros;
    private List<ImagensCategoria> imagensCategoria;
    private List<CarroSemCategoriaDTO> carros;
}
