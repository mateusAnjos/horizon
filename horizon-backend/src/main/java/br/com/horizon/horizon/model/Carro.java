package br.com.horizon.horizon.model;

import com.fasterxml.jackson.annotation.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.Hibernate;
import org.hibernate.annotations.*;

import javax.persistence.*;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.*;

@AllArgsConstructor
@Getter
@Setter
@Entity

public class Carro implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    public Carro() {
        this.reserva = new HashSet<>();
        this.imagensCarro = new ArrayList<>();
    }
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String marca;
    @Column(length = 500)
    private String descricao;
    private String modelo;
    private BigDecimal valorDiario;
    @JsonProperty("cor")
    private String cor;
    private String placa;
    private String renavam;
    private String chassi;
    @Column(name = "ativo", columnDefinition = "TINYINT(1)")
    @ColumnDefault("1")
    private boolean ativo;


    @ManyToMany
    @JsonIgnore
    private Set<Reserva> reserva;



    //essa anotação fetch com o TYPE eager "ansioso" serve para o banco já fazer a busca de todas entidades relacionadas no momento em que buscar um objeto carro
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "categoria_id")
    @JsonIdentityReference(alwaysAsId = true)
    @JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
//        @JsonIdentityInfo(
//            generator = ObjectIdGenerators.PropertyGenerator.class,
//            property = "id")
//    @JsonIdentityReference(alwaysAsId = false)
    private Categoria categoria;

    @OneToMany(mappedBy = "carro", cascade = CascadeType.PERSIST)
    @Column(name = "imagens_carro", nullable = true)
    private List<ImagensCarro> imagensCarro;

    @ManyToMany(mappedBy = "carro", fetch = FetchType.EAGER)
    @Column(nullable = true)
    Set<Caracteristicas> caracteristica;

    @ManyToOne(optional = true)
    private Cidade cidade;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        Carro carro = (Carro) o;
        return id != null && Objects.equals(id, carro.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    public void excluir(){
        this.ativo = false;
    }
}
