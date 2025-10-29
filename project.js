
// Sistema de tarjetas Tu Llave - Transporte público

// Clase base Tarjeta
class Tarjeta {
  constructor(numero, titular) {
    if (new.target === Tarjeta) {
      throw new Error("Tarjeta es abstracta");
    }
    this.numero = numero;
    this.titular = titular;
    this.saldo = 0;
  }


}

// Tarjeta básica
class TarjetaBasica extends Tarjeta {
  recargar(monto) {
    if (monto <= 0) throw new Error("Monto inválido");
    if (monto > 200000) throw new Error("Límite de recarga: 200.000");
    this.saldo += monto;
  }

  pagarViaje(costo) {
    if (costo <= 0) throw new Error("Costo inválido");
    if (costo > this.saldo) throw new Error("Saldo insuficiente");
    this.saldo -= costo;
  }
}

// Tarjeta con descuento
class TarjetaPersonalizada extends Tarjeta {
  constructor(numero, titular, descuento) {
    super(numero, titular);
    this.descuento = descuento;
  }

  recargar(monto) {
    if (monto <= 0) throw new Error("Monto inválido");
    this.saldo += monto;
  }

  aplicarDescuento(costo) {
    return costo * (1 - this.descuento);
  }

  validarSubsidio() {
    return true;
  }

  pagarViaje(costo) {
    if (costo <= 0) throw new Error("Costo inválido");
    const costoFinal = this.aplicarDescuento(costo);
    if (costoFinal > this.saldo) throw new Error("Saldo insuficiente");
    this.saldo -= costoFinal;
  }
}

// Tarjeta con subsidio
class TarjetaSubsidio extends Tarjeta {
  constructor(numero, titular, viajesSubsidiados, tarifaSubsidio) {
    super(numero, titular);
    this.viajesSubsidiados = viajesSubsidiados;
    this.tarifaSubsidio = tarifaSubsidio;
    this.viajesUsados = 0;
  }

  recargar(monto) {
    if (monto <= 0) throw new Error("Monto inválido");
    this.saldo += monto;
  }

  validarSubsidio() {
    return this.viajesUsados < this.viajesSubsidiados;
  }

  aplicarDescuento(costo) {
    if (this.validarSubsidio()) {
      return this.tarifaSubsidio;
    }
    return costo;
  }

  pagarViaje(costo) {
    if (costo <= 0) throw new Error("Costo inválido");
    const costoFinal = this.aplicarDescuento(costo);
    if (costoFinal > this.saldo) throw new Error("Saldo insuficiente");
    this.saldo -= costoFinal;
    if (costoFinal === this.tarifaSubsidio) {
      this.viajesUsados++;
    }
  }
}

// Servicio de bicicletas
class BiciPublica {
  constructor(tarifa) {
    this.tarifa = tarifa;
  }

  aplicarDescuento(monto, tipoUsuario) {
    if (tipoUsuario === "estudiante") {
      return monto * 0.5;
    }
    return monto;
  }

  validarSubsidio(tipoUsuario) {
    return tipoUsuario === "estudiante";
  }
}

// Servicio de parqueadero
class ParqueaderoPublico {
  constructor(tarifa) {
    this.tarifa = tarifa;
  }

  aplicarDescuento(monto, tipoUsuario) {
    if (tipoUsuario === "residente") {
      return monto * 0.6;
    }
    if (tipoUsuario === "discapacitado") {
      return monto * 0.4;
    }
    return monto;
  }

  validarSubsidio(tipoUsuario) {
    return tipoUsuario === "residente" || tipoUsuario === "discapacitado";
  }
}

// Programa principal
function main() {
  console.log("=== Sistema Tu Llave ===\n");

  // Crear tarjetas
  const tarjeta1 = new TarjetaBasica("001", "Carlos");
  const tarjeta2 = new TarjetaPersonalizada("002", "María", 0.2);
  const tarjeta3 = new TarjetaSubsidio("003", "Julián", 5, 1000);

  // Recargar saldo
  tarjeta1.recargar(20000);
  tarjeta2.recargar(50000);
  tarjeta3.recargar(30000);

  console.log("Saldos iniciales:");
  console.log(`${tarjeta1.titular}: $${tarjeta1.saldo}`);
  console.log(`${tarjeta2.titular}: $${tarjeta2.saldo}`);
  console.log(`${tarjeta3.titular}: $${tarjeta3.saldo}`);

  // Pagar viajes
  const costoViaje = 2950;
  tarjeta1.pagarViaje(costoViaje);
  tarjeta2.pagarViaje(costoViaje);
  tarjeta3.pagarViaje(costoViaje);

  console.log("\nSaldos después de un viaje:");
  console.log(`${tarjeta1.titular}: $${tarjeta1.saldo}`);
  console.log(`${tarjeta2.titular}: $${tarjeta2.saldo}`);
  console.log(`${tarjeta3.titular}: $${tarjeta3.saldo}`);

  // Probar subsidio
  console.log(`\nViajes subsidiados usados: ${tarjeta3.viajesUsados}/${tarjeta3.viajesSubsidiados}`);

  // Servicios externos
  const bici = new BiciPublica(1500);
  const parqueadero = new ParqueaderoPublico(2800);

  console.log("\n=== Servicios ===");
  console.log(`Bici estudiante: $${bici.aplicarDescuento(3000, "estudiante")}`);
  console.log(`Parqueadero residente: $${parqueadero.aplicarDescuento(2800, "residente")}`);
}

main();
