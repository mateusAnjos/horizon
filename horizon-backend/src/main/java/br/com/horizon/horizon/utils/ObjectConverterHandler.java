package br.com.horizon.horizon.utils;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import java.util.List;
import java.util.stream.Collectors;

public class ObjectConverterHandler {
    //método usado para converter uma determinada lista de objetos em outra do tipo da classe target U
    // tanto a classe Class quanto List aceitam GENERICS em seu tipo, então podemos ter essa flexibilidade para deixar o tipo indeterminado e atribuí-lo de acordo com nossas necessidades
    public static <T, U> List<U> converterLista(List<T> lista, Class<U> targetClass) {
        // primeiro cria a lista pra classe que vai ser convertida
        // instancia o mapeamento de objeto
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        // usa uma função de alta-ordem para mapear a lista recebida como parâmetro, convertendo cada elemento para o tipo targetClass e o retornando pra lista, o collect é necesário para converser o stream em lista.
        // implementação mais simples usando for
        //percorre a lista recebida com o objeto inicial
//        for (T objeto : lista) {
//            // faz a conversão de cada objeto da lista inicial pra lista que vai ser convertida
//            resultado.add(mapper.convertValue(objeto, targetClass));
//        }
        return lista.stream().map(x -> mapper.convertValue(x, targetClass)).collect(Collectors.toList());
    }

    public static <T, U> U converterObjeto(T baseClass, Class<U> targetClass){
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        return mapper.convertValue(baseClass, targetClass);
    }

    public static <T, U> U converterObjetoAdicionando(T baseClass, Class<U> targetClass){
        ObjectMapper mapper = new ObjectMapper();
        return mapper.convertValue(baseClass, targetClass);
    }
}
