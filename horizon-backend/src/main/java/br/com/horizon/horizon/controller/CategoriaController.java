package br.com.horizon.horizon.controller;

import br.com.horizon.horizon.model.dto.CategoriaCarroDTO;
import br.com.horizon.horizon.model.dto.CategoriaDTO;
import br.com.horizon.horizon.model.dto.CategoriaIdDTO;
import br.com.horizon.horizon.service.CategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/categoria")
public class CategoriaController {
    @Autowired
    CategoriaService categoriaService;

    @GetMapping
    @ResponseBody
    public ResponseEntity<List<CategoriaDTO>> buscarTodos() {
        List<CategoriaDTO> categoriaDTOList = categoriaService.buscarTodos();
        return ResponseEntity.ok(categoriaDTOList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoriaDTO> buscarPorId(@PathVariable Long id){
        CategoriaDTO categoriaDTO = categoriaService.buscarPorId(id);

        return ResponseEntity.ok(categoriaDTO);
    }

    @GetMapping("/nome/{descricao}")
    public ResponseEntity<CategoriaCarroDTO> buscarPorDescricao(@PathVariable String descricao){
        CategoriaCarroDTO categoriaDTO = categoriaService.buscarPorCategoria(descricao);
        return ResponseEntity.ok(categoriaDTO);
    }

    @PostMapping
    public ResponseEntity<CategoriaDTO> salvar(@RequestBody CategoriaDTO categoriaDTO){
        categoriaDTO = categoriaService.salvar(categoriaDTO);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(categoriaDTO.getId()).toUri();
        return ResponseEntity.created(uri).body(categoriaDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoriaDTO> atualizacaoComAlteracaoCompleta(@PathVariable Long id, @RequestBody CategoriaDTO categoriaDTO){
         categoriaDTO = categoriaService.alteracaoTotal(id, categoriaDTO);
        return ResponseEntity.ok(categoriaDTO);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id){
        categoriaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
