package br.com.horizon.horizon.model.Serializer;

import br.com.horizon.horizon.model.Categoria;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import java.io.IOException;

public class CategoriaSerializer extends JsonSerializer<Categoria> {
    @Override
    public void serialize(Categoria categoria, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        jsonGenerator.writeStartObject();
        jsonGenerator.writeObjectField("id", categoria.getId());
        jsonGenerator.writeStringField("descricao", categoria.getDescricao());
        jsonGenerator.writeStringField("nome", categoria.getNome());
        // Serializar a lista de carros
        jsonGenerator.writeObjectField("carros", categoria.getCarros());


        // Serializar a lista de imagens da categoria
        jsonGenerator.writeObjectField("imagensCategoria", categoria.getImagensCategoria());
        // Outros campos da categoria que você deseja serializar

        jsonGenerator.writeEndObject();
    }
}
