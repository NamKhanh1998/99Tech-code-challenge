declare module 'toformat' {
  import { BigConstructor, Big } from 'big.js';

  interface BigWithFormat extends Big {
    plus(n: Big.BigSource, rm?: Big.RoundingMode): BigWithFormat;
    minus(n: Big.BigSource, rm?: Big.RoundingMode): BigWithFormat;
    div(n: Big.BigSource, rm?: Big.RoundingMode): BigWithFormat;
    times(n: Big.BigSource, rm?: Big.RoundingMode): BigWithFormat;
    mod(n: Big.BigSource, rm?: Big.RoundingMode): BigWithFormat;
    pow(n: number, rm?: Big.RoundingMode): BigWithFormat;
    abs(): BigWithFormat;
    neg(): BigWithFormat;
    sqrt(): BigWithFormat;
    round(dp?: number, rm?: Big.RoundingMode): BigWithFormat;
    toFormat(dp?: number, rm?: number, fmt?: object): string;
    toFormat(dp?: number, fmt?: object): string;
    toFormat(fmt?: object): string;
  }

  interface BigConstructorWithFormat extends BigConstructor {
    new(value: Big.BigSource): BigWithFormat;
    (value: Big.BigSource): BigWithFormat;
    format: {
      decimalSeparator: string;
      groupSeparator: string;
      groupSize: number;
      secondaryGroupSize: number;
      fractionGroupSeparator: string;
      fractionGroupSize: number;
    };
  }

  import { Decimal, Config, Numeric } from 'decimal.js-light';

  interface DecimalWithFormat extends Decimal {
    abs(): DecimalWithFormat;
    neg(): DecimalWithFormat;
    negated(): DecimalWithFormat;
    plus(y: Numeric): DecimalWithFormat;
    add(y: Numeric): DecimalWithFormat;
    minus(y: Numeric): DecimalWithFormat;
    sub(y: Numeric): DecimalWithFormat;
    times(y: Numeric): DecimalWithFormat;
    mul(y: Numeric): DecimalWithFormat;
    div(y: Numeric): DecimalWithFormat;
    dividedBy(y: Numeric): DecimalWithFormat;
    mod(y: Numeric): DecimalWithFormat;
    modulo(y: Numeric): DecimalWithFormat;
    pow(y: Numeric): DecimalWithFormat;
    toPower(y: Numeric): DecimalWithFormat;
    sqrt(): DecimalWithFormat;
    squareRoot(): DecimalWithFormat;
    toDecimalPlaces(dp?: number, rm?: number): DecimalWithFormat;
    todp(dp?: number, rm?: number): DecimalWithFormat;
    toInteger(): DecimalWithFormat;
    toint(): DecimalWithFormat;
    toSignificantDigits(sd?: number, rm?: number): DecimalWithFormat;
    tosd(sd?: number, rm?: number): DecimalWithFormat;
    toFormat(dp?: number, rm?: number, fmt?: object): string;
    toFormat(dp?: number, fmt?: object): string;
    toFormat(fmt?: object): string;
  }

  type DecimalConstructorWithFormat = Omit<typeof Decimal, 'new'> & {
    new(value: Numeric): DecimalWithFormat;
    set(config: Config): void;
  };

  function toFormat(ctor: BigConstructor): BigConstructorWithFormat;
  function toFormat(ctor: typeof Decimal): DecimalConstructorWithFormat;
  export default toFormat;
}
