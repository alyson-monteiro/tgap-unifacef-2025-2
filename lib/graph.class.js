export default class Graph {

  // Método construtor
  constructor(isDirected = false) {
    /*
      Nesta implementação, o grafo pode ser direcionado ou não, 
      dependendo do valor do atributo isDirected. Vértices e 
      arestas serão representados por uma lista de adjacência,
      implementada com o uso da classe Map nativa do JavaScript. 
    */
    this.isDirected = isDirected
    this.vertices = new Set()   // Set não permite elementos repetidos
    // Cada vértice aponta para um Map que armazena os vértices adjacentes
    // e a quantidade de arestas entre eles
    this.adjList = new Map()
  }

  // Método que adiciona um vértice ao grafo
  addVertex(v) {
    // Adiciona o vértice ao conjunto vertices, caso ainda não exista
    if(! this.vertices.has(v)) {
      this.vertices.add(v)

      // Cada vértice possui um Map para armazenar destinos e contagens
      this.adjList.set(v, new Map())
    }
  }

  // Método que adiciona uma aresta ao grafo
  addEdge(v, w) {   // v e w são vértices
    // Se o vértice v ainda não existe, cria-o
    if(! this.vertices.has(v)) this.addVertex(v)

    // Se o vértice w ainda não existe, cria-o
    if(! this.vertices.has(w)) this.addVertex(w)

    // Obtém o mapa de adjacência de v
    const fromV = this.adjList.get(v)
    // Atualiza a quantidade de arestas v -> w
    fromV.set(w, (fromV.get(w) || 0) + 1)

    // Se o grafo não for direcionado, precisamos atualizar também
    // a contagem da aresta w -> v
    if(! this.isDirected) {
      const fromW = this.adjList.get(w)
      fromW.set(v, (fromW.get(v) || 0) + 1)
    }
  }

  // Método que remove um vértice do grafo
  removeVertex(v) {
    // Age apenas se o vértice existir
    if(! this.vertices.has(v)) return

    let referenced = false

    // Verifica se o vértice que está sendo excluído está presente
    // na lista de adjacência de algum outro vértice
    for(let vtx of this.vertices) {
      if(this.adjList.get(vtx).has(v)) {
        referenced = true
        break
      }
    }

    // Para que um vértice possa ser removido, sua lista de adjacência
    // deve estar vazia e ele não pode estar referenciado por nenhum
    // outro vértice
    if(this.adjList.get(v).size == 0 && !referenced) {

      // Remove o vértice da lista de vértices
      this.vertices.delete(v)

      // Remove a entrada da lista de adjacência
      this.adjList.delete(v)
    }
    else throw new Exception('ERRO: impossível excluir um vértice com arestas incidentes a ele.')
  }

  // Método que remove uma aresta do grafo
  removeEdge(v, w) {   // v e w são os vértices incidentes à aresta
    // Verifica se tanto v quanto w são vértices válidos
    if(!(this.vertices.has(v) && this.vertices.has(w))) return

    // Obtém o mapa de adjacência de v
    const fromV = this.adjList.get(v)
    const countVW = fromV.get(w)
    if(countVW == null) return

    // Diminui a contagem ou remove a entrada se for a última aresta
    if(countVW > 1) fromV.set(w, countVW - 1)
    else fromV.delete(w)

    // Se o grafo não for direcionado, repete o processo inverso
    if(! this.isDirected) {
      const fromW = this.adjList.get(w)
      const countWV = fromW.get(v)
      if(countWV == null) return
      if(countWV > 1) fromW.set(v, countWV - 1)
      else fromW.delete(v)
    }
  }

}
