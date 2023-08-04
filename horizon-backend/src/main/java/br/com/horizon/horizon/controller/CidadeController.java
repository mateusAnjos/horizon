package br.com.horizon.horizon.controller;

import br.com.horizon.horizon.model.dto.CategoriaDTO;
import br.com.horizon.horizon.model.dto.CidadeDTO;
import br.com.horizon.horizon.service.CidadeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/cidade")
public class CidadeController {

    @Autowired
    CidadeService cidadeService;

    @GetMapping
    @ResponseBody
    public ResponseEntity<List<CidadeDTO>> buscarTodos() {
        List<CidadeDTO> cidadeDTOList = cidadeService.buscarTodos();
        return ResponseEntity.ok(cidadeDTOList);
    }

    @PostMapping
    public ResponseEntity<CidadeDTO> salvar(@RequestBody CidadeDTO cidadeDTO){
        cidadeDTO = cidadeService.salvar(cidadeDTO);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(cidadeDTO.getId()).toUri();
        return ResponseEntity.created(uri).body(cidadeDTO);
    }
}
