class WeightedEdge {
  constructor(adjacent, weight = null, label = null) {
    this.adjacent = adjacent    // Vértice adjacente
    this.weight = weight        // Peso da aresta; opcional
    this.label = label          // Rótulo da aresta; opcional
  }
}

/*
  Implementação de uma classe de grafos que suporta arestas com pesos
  (grafo ponderado)
*/
export default class WeightedGraph {

  constructor(isDirected = false) {
    this.isDirected = isDirected
    this.vertices = new Set()
    this.adjList = new Map()
  }

  // Método que adiciona um vértice ao grafo
  addVertex(v) {
    if (!this.vertices.has(v)) {
      this.vertices.add(v)
      this.adjList.set(v, [])
    }
  }

  // Método que adiciona uma nova aresta ao grafo
  addEdge(v, w, weight = null, label = null) {
    if (!this.vertices.has(v)) this.addVertex(v)
    if (!this.vertices.has(w)) this.addVertex(w)

    const edge1 = new WeightedEdge(w, weight, label)
    this.adjList.get(v).push(edge1)

    if (!this.isDirected) {
      const edge2 = new WeightedEdge(v, weight, label)
      this.adjList.get(w).push(edge2)
    }
  }

  // Método que remove um vértice do grafo
  removeVertex(v) {
    if (!this.vertices.has(v)) return

    let referenced = false

    for (const vtx of this.vertices) {
      const adjList = this.adjList.get(vtx)
      for (const edge of adjList) {
        if (edge.adjacent === v) {
          referenced = true
          break
        }
      }
    }

    if (this.adjList.get(v).length === 0 && !referenced) {
      this.vertices.delete(v)
      this.adjList.delete(v)
    } else {
      throw new Error('ERRO: impossível excluir um vértice com arestas incidentes.')
    }
  }

  // Método que remove uma aresta do grafo
  removeEdge(v, w) {
    if (this.vertices.has(v) && this.vertices.has(w)) {
      const edgesV = this.adjList.get(v)
      const indexW = edgesV.findIndex(edge => edge.adjacent === w)
      if (indexW >= 0) edgesV.splice(indexW, 1)

      if (!this.isDirected) {
        const edgesW = this.adjList.get(w)
        const indexV = edgesW.findIndex(edge => edge.adjacent === v)
        if (indexV >= 0) edgesW.splice(indexV, 1)
      }
    }
  }

  /*
    Método que determina o menor caminho entre um vértice e
    todos os demais usando o algoritmo de Dijkstra
  */
  shortestDistance(initialVertex) {
    const result = {}

    for (let vtx of this.vertices) {
      result[vtx] = {
        isClosed: false,
        distance: Infinity,
        parent: null
      }
    }

    result[initialVertex].isClosed = true
    result[initialVertex].distance = 0
    result[initialVertex].parent = initialVertex

    let currentVertex = initialVertex

    while (currentVertex) {
      const edges = this.adjList.get(currentVertex)

      for (let e of edges) {
        const newDist = result[currentVertex].distance + e.weight
        if (newDist < result[e.adjacent].distance) {
          result[e.adjacent].distance = newDist
          result[e.adjacent].parent = currentVertex
        }
      }

      currentVertex = null
      let minDistance = Infinity

      for (let vtx of this.vertices) {
        if (!result[vtx].isClosed && result[vtx].distance < minDistance) {
          minDistance = result[vtx].distance
          currentVertex = vtx
        }
      }

      if (currentVertex) result[currentVertex].isClosed = true
    }

    return result
  }

}