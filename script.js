//interfaz
const Benefit = {
  applyDiscount: function () {},
  validateBenefit: function () {},
};

//targeta, js no permite clase abstrapta 
class Card {
  constructor(cardNumber, balance = 0) {
    this.cardNumber = cardNumber;
    this.balance = balance;
  }

  recharge(amount) {
    if (amount <= 0) throw new Error("El monto debe ser positivo");
    this.balance += amount;
    return this.balance;
  }

  pay(amount, service = "TransMilenio") {
    if (this.balance < amount) {
      throw new Error(
        `Saldo insuficiente. Necesita: $${amount}, tiene: $${this.balance}`
      );
    }
    this.balance -= amount;
    console.log(`Pagó $${amount} por ${service}. Saldo: $${this.balance}`);
    return this.balance;
  }

  checkBalance() {
    return this.balance;
  }
}

//targeta normal que deciende de la targeta base 
class NormalCard extends Card {
  constructor(cardNumber, balance = 0) {
    super(cardNumber, balance);
    this.type = "Normal";
  }

  payTravel(baseCost = 3000) {
    console.log(`Pagando tarifa completa: $${baseCost}`);
    return this.pay(baseCost);
  }
}

//targeta subsidiada que deciende de la targeta base 
class SubsidizedCard extends Card {
  constructor(cardNumber, balance = 0) {
    super(cardNumber, balance);
    this.type = "Subsidiada";
    this.discountPercentage = 0.25;
  }

  applyDiscount(amount) {
    return amount * (1 - this.discountPercentage);
  }

  validateBenefit() {
    return true; 
  }

  payTravel(baseCost = 3000) {
    const discountedCost = this.applyDiscount(baseCost);
    console.log(
      `Tarifa con subsidio 25%: $${discountedCost} (Original: $${baseCost})`
    );
    return this.pay(discountedCost);
  }
}

//sistema de bicicletas publicas
class PublicBike {
  constructor() {
    this.hourlyRate = 5000;
    this.name = "BiciPública";
  }

  applyDiscount(amount) {
    return amount * 0.8;
  }

  validateBenefit() {
    return true;
  }

  useService(card, hours = 1) {
    const baseCost = this.hourlyRate * hours;
    let finalCost = baseCost;

    if (card.type === "Subsidiada") {
      finalCost = this.applyDiscount(baseCost);
      console.log(`\nAlquiler de bicicleta con descuento: $${finalCost}`);
    } else {
      console.log(`\nAlquiler de bicicleta tarifa estándar: $${finalCost}`);
    }

    return card.pay(finalCost, this.name);
  }
}

//sistema de parqueaderos publicos
class PublicParking {
  constructor() {
    this.hourlyRate = 4000;
    this.name = "ParqueaderoPúblico";
  }

  applyDiscount(amount) {
    return amount * 0.85; 
  }

  validateBenefit() {
    return true;
  }

  useService(card, hours = 1) {
    const baseCost = this.hourlyRate * hours;
    let finalCost = baseCost;

    if (card.type === "Subsidiada") {
      finalCost = this.applyDiscount(baseCost);
      console.log(`\nParqueadero con descuento: $${finalCost}`);
    } else {
      console.log(`\nParqueadero tarifa estándar: $${finalCost}`);
    }

    return card.pay(finalCost, this.name);
  }
}

//sistema de trasmilenio
class TuLlaveSystem {
  constructor() {
    this.cards = [];
    this.services = [];
  }

  addCard(card) {
    this.cards.push(card);
    console.log(`Tarjeta ${card.cardNumber} registrada (Tipo: ${card.type})`);
  }

  addService(service) {
    this.services.push(service);
    console.log(`Servicio ${service.name} agregado al sistema`);
  }

  showAllBenefits() {
    console.log("\n=== BENEFICIOS DISPONIBLES ===");
    
    this.cards.forEach(card => {
      if (card.validateBenefit && card.validateBenefit()) {
        console.log(`Tarjeta ${card.cardNumber}: Tiene beneficios activos`);
      }
    });

    this.services.forEach(service => {
      if (service.validateBenefit()) {
        console.log(`${service.name}: Ofrece descuentos`);
      }
    });
  }
}

//prueba del codigo para correr en node js
function runDemo() {
  console.log("=== SISTEMA TU LLAVE - BOGOTÁ ===\n");

  const system = new TuLlaveSystem();

  const normalCard = new NormalCard("001", 50000);
  const subsidizedCard = new SubsidizedCard("002", 50000);

  system.addCard(normalCard);
  system.addCard(subsidizedCard);

  const bike = new PublicBike();
  const parking = new PublicParking();

  system.addService(bike);
  system.addService(parking);

  console.log("\n=== PRUEBA TRANSMILENIO ===");
  normalCard.payTravel();
  subsidizedCard.payTravel();

  console.log("\n=== PRUEBA SERVICIO DE BICICLETA (2 horas) ===");
  bike.useService(normalCard, 2);
  bike.useService(subsidizedCard, 2);

  console.log("\n=== PRUEBA PARQUEADERO (3 horas) ===");
  parking.useService(normalCard, 3);
  parking.useService(subsidizedCard, 3);

  console.log("\n=== SALDOS FINALES ===");
  console.log(`Tarjeta Normal: $${normalCard.checkBalance()}`);
  console.log(`Tarjeta Subsidiada: $${subsidizedCard.checkBalance()}`);

  system.showAllBenefits();
}

runDemo();