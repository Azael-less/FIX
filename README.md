# Mutaciones
## Crear Productos
mutation {
  createProducts(
    products: [
      {
        brand: "Nike"
        color: "Rojo"
        model: "Air Max"
        pares: 1
        size: "45"
      },
      {
        brand: "Nike"
        color: "Rojo"
        model: "Air Max"
        pares: 1
        size: "45"
      }
    ]
  ) {
    id
    model {
      name
    }
    brand {
      name
    }
    size
  }
}
## Registrar Venta
mutation {
  registerSale(
    input: {
      buyerName: "Raul"
      buyerEmail: "raulpcq@example.com"
      buyerId: "1007170988"
      productIds: [83511, 78170]
      price: "$120.000"
    }
  ) {
    id
    buyerName
    buyerEmail
    soldAt
    price
    products {
      id
      model {
        name
      }
      brand {
        name
      }
    }
  }
}
## Crear Marca
mutation {
  createBrand(createBrandInput: { name: "Nike" }) {
    id
    name
  }
}
## Crear Modelo
mutation {
  createModel(createModelInput: { name: "Air Max" }) {
    id
    name
  }
}
## Crear Color
mutation {
  createColor(createColorInput: { name: "Rojo" }) {
    id
    name
  }
}
## Actualizar Ubicación de Productos
mutation {
  updateProductsLocation(location: "store", productIds: [42130, 66103]) {
    id
    brand {
      name
    }
    color {
      name
    }
    model {
      name
    }
    size
    isSold
    location
  }
}
## Devolver Producto
mutation {
  returnProduct(productIds: [83511, 78170]) {
    id
    buyerId
    buyerName
    buyerEmail
    soldAt
    price
    products {
      model {
        name
      }
    }
  }
}
# Consultas
## Obtener Todos los Productos
query {
  getAllProducts {
    id
    brand {
      name
    }
    model {
      name
    }
    color {
      name
    }
    size
    location
    isSold
  }
}
## Obtener Todos los Colores
query {
  findAllColors {
    name
  }
}
## Obtener Todas las Marcas
query {
  findAllBrands {
    name
  }
}
## Obtener Todos los Modelos
query {
  findAllModels {
    name
  }
}
## Zapatos Vendidos
query {
  soldShoes {
    id
    brand {
      name
    }
    model {
      name
    }
    color {
      name
    }
    size
  }
}
## Zapatos en Almacén
query {
  shoesInWarehouse {
    id
    brand {
      name
    }
    model {
      name
    }
    color {
      name
    }
    size
  }
}
## Zapatos en Tienda
query {
  shoesInStore {
    id
    brand {
      name
    }
    model {
      name
    }
    color {
      name
    }
    size
  }
}
