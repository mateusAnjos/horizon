package br.com.horizon.horizon.model.dto;

import br.com.horizon.horizon.model.*;
import com.fasterxml.jackson.annotation.*;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import java.io.Serial;
import java.io.Serializable;
import java.util.List;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
//@JsonInclude(JsonInclude.Include.NON_NULL)
public class UsuarioDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;


    private Long id;
    private String password;

    private String username;

    private Pessoa pessoa;

    @JsonIgnore
    private String enabled;

    @JsonIgnore
    private String accountNonExpired;

    @JsonIgnore
    private String credentialsNonExpired;

    @JsonIgnore
    private String accountNonLocked;

    private List<Funcao> authorities;


    @JsonIgnore
    Set<ReservaDTO> reserva;

    public UsernamePasswordAuthenticationToken converter(){
        return new UsernamePasswordAuthenticationToken(this.username, this.password);
    }

    @Override
    public String toString() {
        return "UsuarioDTO{" +
                "id=" + id +
                ", senha='" + password + '\'' +
                ", pessoa='" + pessoa + '\'' +
                ", username='" + username + '\'' +
//                ", funcao=" + funcao +
                ", reserva=" + reserva +
                '}';
    }
}
