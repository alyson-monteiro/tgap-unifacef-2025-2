export default class MultiEdgeGraph {

  // Método construtor
  constructor(isDirected = false) {
    /*
      Nesta implementação, o grafo pode ser direcionado ou não,
      dependendo do valor do atributo isDirected. Vértices e
      arestas são representados por uma lista de adjacência
      usando arrays, permitindo múltiplas arestas entre vértices.
    */
    this.isDirected = isDirected
    this.vertices = []           // Array permite manipulação simples
    // Cada vértice aponta para um array com seus vizinhos
    this.adjList = new Map()
  }

  // Método que adiciona um vértice ao grafo
  addVertex(v) {
    // Adiciona o vértice ao array vertices, caso ainda não exista
    if(! this.vertices.includes(v)) {
      this.vertices.push(v)

      // Cada vértice possui um array para armazenar seus destinos
      this.adjList.set(v, [])
    }
  }

  // Método que adiciona uma aresta ao grafo
  addEdge(v, w) {   // v e w são vértices
    // Se o vértice v ainda não existe, cria-o
    if(! this.vertices.includes(v)) this.addVertex(v)

    // Se o vértice w ainda não existe, cria-o
    if(! this.vertices.includes(w)) this.addVertex(w)

    // Adiciona w à lista de adjacência de v
    this.adjList.get(v).push(w)

    // Se o grafo não for direcionado, também adiciona v à lista de w
    if(! this.isDirected) this.adjList.get(w).push(v)
  }

  // Método que remove um vértice do grafo
  removeVertex(v) {
    // Age apenas se o vértice existir
    if(! this.vertices.includes(v)) return

    let referenced = false

    // Verifica se o vértice está presente na lista de adjacência
    // de algum outro vértice
    for(let vtx of this.vertices) {
      if(this.adjList.get(vtx).includes(v)) {
        referenced = true
        break
      }
    }

    // Para que um vértice possa ser removido, sua lista de adjacência
    // deve estar vazia e ele não pode estar referenciado por nenhum
    // outro vértice
    if(this.adjList.get(v).length === 0 && !referenced) {

      // Remove o vértice da lista de vértices
      this.vertices = this.vertices.filter(vtx => vtx !== v)

      // Remove a entrada da lista de adjacência
      this.adjList.delete(v)
    }
    else throw new Error('ERRO: impossível excluir um vértice com arestas incidentes a ele.')
  }

  // Método que remove uma aresta do grafo
  removeEdge(v, w) {   // v e w são os vértices incidentes à aresta
    // Verifica se tanto v quanto w são vértices válidos
    if(!(this.vertices.includes(v) && this.vertices.includes(w))) return

    // Obtém o array de adjacência de v
    const fromV = this.adjList.get(v)
    const indexVW = fromV.indexOf(w)
    if(indexVW === -1) return

    // Remove apenas a primeira ocorrência da aresta v -> w
    fromV.splice(indexVW, 1)

    // Se o grafo não for direcionado, repete o processo inverso
    if(! this.isDirected) {
      const fromW = this.adjList.get(w)
      const indexWV = fromW.indexOf(v)
      if(indexWV === -1) return
      fromW.splice(indexWV, 1)
    }
  }
}

