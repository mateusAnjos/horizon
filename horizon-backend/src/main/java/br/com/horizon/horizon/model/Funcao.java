package br.com.horizon.horizon.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;

import javax.persistence.*;
import java.io.Serial;
import java.io.Serializable;
import java.util.List;


@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
public class Funcao implements GrantedAuthority, Serializable {

    public Funcao(Long id, String authority){
        this.id = id;
        this.authority = authority;
    }
    public Funcao(Long id) {
        this.id = id;
    }
    @Serial
    private static final long serialVersionUID = 1L;
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tipo", nullable = false, unique = true)
    private String authority;

    @ManyToMany(mappedBy = "authorities")
//    @JsonBackReference
    @JsonIgnore
    private List<Usuario> usuarios;

    @Override
    public String getAuthority() {
        return this.authority;
    }
}
