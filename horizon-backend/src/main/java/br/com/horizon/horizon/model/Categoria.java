package br.com.horizon.horizon.model;

import br.com.horizon.horizon.model.Serializer.CategoriaSerializer;
import br.com.horizon.horizon.model.dto.CarroSemCategoriaDTO;
import com.fasterxml.jackson.annotation.*;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.*;

import javax.persistence.*;
import java.io.Serial;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@AllArgsConstructor
@Getter
@Setter
@Entity
@JsonSerialize(using = CategoriaSerializer.class)
public class Categoria implements Serializable {


    public Categoria(){
        this.imagensCategoria = new ArrayList<>();
    }

    public Categoria(String descricao, String nome) {
        this.descricao = descricao;
        this.nome = nome;
    }

    public Categoria(Long id, String descricao, String nome) {
        this.descricao = descricao;
        this.nome = nome;
    }

    @Serial
    private static final long serialVersionUID = 1L;
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(columnDefinition = "TEXT")
    private String descricao;
    private String nome;

    @Transient
    private int qntCarros;

    @OneToMany(mappedBy = "categoria")
    @Column(nullable = true)
    private List<Carro> carros;

    @OneToMany(mappedBy = "categoria", cascade = CascadeType.PERSIST, fetch = FetchType.EAGER)
    @Column(nullable = true)
    private List<ImagensCategoria> imagensCategoria;

    public List<CarroSemCategoriaDTO> getCarros() {
        // Converte a lista de Carro para uma lista de CarroDTO
        List<CarroSemCategoriaDTO> carrosDTO = new ArrayList<>();
        if(carros != null){
            for (Carro carro : carros) {
                CarroSemCategoriaDTO carroDTO = new CarroSemCategoriaDTO();
                carroDTO.setId(carro.getId());
                carroDTO.setModelo(carro.getModelo());
                carroDTO.setMarca(carro.getMarca());
                carroDTO.setImagensCarro(carro.getImagensCarro());
                carroDTO.setCor(carro.getCor());
                carroDTO.setDescricao(carro.getDescricao());
                carroDTO.setCidade(carro.getCidade());
                carroDTO.setCaracteristica(carro.getCaracteristica());
                carroDTO.setValorDiario(carro.getValorDiario());
                carrosDTO.add(carroDTO);

            }
        }

        return carrosDTO;
    }



    public int getQntCarros() {
        if (carros != null) {
            return qntCarros;
        }
        return qntCarros;
    }

    public void setQntCarros(int qntCarros) {
        if(carros != null){
            this.qntCarros = carros.size();
        }

    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Categoria categoria = (Categoria) o;
        return id.equals(categoria.id) && Objects.equals(descricao, categoria.descricao) && Objects.equals(nome, categoria.nome) && Objects.equals(carros, categoria.carros) && Objects.equals(imagensCategoria, categoria.imagensCategoria);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, descricao, nome, carros, imagensCategoria);
    }

    @Override
    public String toString() {
        return "Categoria{" +
                "id=" + id +
                ", descricao='" + descricao + '\'' +
                ", nome='" + nome + '\'' +
                ", qntCarros=" + qntCarros +
                ", carros=" + carros +
                ", imagensCategoria=" + imagensCategoria +
                '}';
    }
}
