package br.com.horizon.horizon.model.dto;

import br.com.horizon.horizon.model.Caracteristicas;
import br.com.horizon.horizon.model.Carro;
import br.com.horizon.horizon.model.Categoria;
import br.com.horizon.horizon.model.ImagensCategoria;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.springframework.web.bind.annotation.GetMapping;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import java.io.Serial;
import java.io.Serializable;
import java.util.List;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CategoriaDTO implements Serializable {

    public CategoriaDTO (Long id){
        this.id = id;
    }

    @Serial
    private static final long serialVersionUID = 1L;


    public CategoriaDTO (Categoria entity){
        this.id = entity.getId();
        this.nome = entity.getNome();
        this.descricao = entity.getDescricao();
        this.imagensCategoria = entity.getImagensCategoria();
        this.qntCarros = entity.getQntCarros();

    }



    private Long id;
    private String descricao;
    private String nome;
    private int qntCarros;
    private List<ImagensCategoria> imagensCategoria;

    private List<CarroSemCategoriaDTO> carros;
}
