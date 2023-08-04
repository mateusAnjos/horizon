package br.com.horizon.horizon.model;

import com.fasterxml.jackson.annotation.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.*;

import javax.persistence.*;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.validation.constraints.Future;
import javax.validation.constraints.FutureOrPresent;
import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
public class Reserva implements Serializable {


    @Serial
    private static final long serialVersionUID = 1L;


//    @Getter(AccessLevel.NONE)
//    @Setter(AccessLevel.NONE)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @FutureOrPresent(message = "A data deve ser posterior a data de hoje")
    private LocalDate retirada;


    @FutureOrPresent(message = "A data deve ser posterior a data de hoje")
    private LocalDate entrega;
    private Double valorTotal;

    @Column(name = "ativo", columnDefinition = "TINYINT(1)")
    @ColumnDefault("1")
    private boolean ativo;

    @ManyToMany(mappedBy = "reserva", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JsonIdentityInfo(
            generator = ObjectIdGenerators.PropertyGenerator.class,
            property = "id")
    private Set<Carro> carro;

    @ManyToOne
//    @JsonManagedReference
    @JoinColumn(name = "usuario_id")
    @JsonIdentityInfo(
            generator = ObjectIdGenerators.PropertyGenerator.class,
            property = "id")
    private Usuario usuario;


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Reserva reserva = (Reserva) o;
        return Objects.equals(id, reserva.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    public void excluir(){
        this.ativo = false;
    }


//    @JsonIgnore
    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "condutor_id", referencedColumnName = "id")
    @JsonManagedReference
    private Condutor condutor;
}
