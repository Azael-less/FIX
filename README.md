# Mutaciones

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

mutation {
  createBrand(createBrandInput: { name: "Nike" }) {
    id
    name
  }
}

mutation {
  createModel(createModelInput: { name: "Air Max" }) {
    id
    name
  }
}

mutation {
  createColor(createColorInput: { name: "Rojo" }) {
    id
    name
  }
}

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

# Queries

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

query {
  findAllColors {
    name
  }
}

query {
  findAllBrands {
    name
  }
}

query {
  findAllModels {
    name
  }
}

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
