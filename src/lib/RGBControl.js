import blaster from 'pi-blaster.js';

class RGBControl {
  constructor(red, green, blue) {
    this.redPin = red;
    this.greenPin = green;
    this.bluePin = blue;

    this.redAmount = 0;
    this.blueAmount = 0;
    this.greenAmount = 0;

    this.strength = 1;
    this.intensity = 0;

    this.lastValues = [];
    this.intervals = [];

    this.run();

    return this;
  }

  clearTimers() {
    this.intervals.map((interval) => clearInterval(interval));
  }

  setColor(red, green, blue) {
    this.redAmount = red / 255;
    this.greenAmount = green / 255;
    this.blueAmount = blue / 255;

    this.run();

    return this;
  }

  setStrength(strength) {
    this.strength = strength;

    return this;
  }

  setIntensity(intensity) {
    this.intensity = intensity;

    this.run();

    return this;
  }

  run() {
    this.clearTimers();
    const intensity = this.intensity * this.strength;

    this.setPin(this.redPin, this.redAmount * intensity);
    this.setPin(this.greenPin, this.greenAmount * intensity);
    this.setPin(this.bluePin, this.blueAmount * intensity);

    return this;
  }

  setPin(pin, amount) {
    //check fading
    if (this.fading) {
      const startValue = this.lastValues[pin] || 0;
      const endValue = amount;

      let currentValue = startValue;

      const t = setInterval(() => {
        if (startValue < endValue) {
          currentValue += 0.01;

          if(currentValue >= endValue) {
            blaster.setPwm(pin, endValue);
            clearInterval(t);
            return;
          }
        } else {
          currentValue -= 0.01;

          if(currentValue <= endValue) {
            blaster.setPwm(pin, endValue);
            this.lastValues[pin] = endValue;
            clearInterval(t);
            return;
          }
        }

        this.lastValues[pin] = currentValue;
        blaster.setPwm(pin, currentValue.toFixed(2));
      }, 5);

      this.intervals.push(t);

    } else {
      this.lastValues[pin] = amount;
      blaster.setPwm(pin, amount);
    }

    return this;
  }

  applyFading() {
    this.fading = true;

    return this;
  }
}

export default RGBControl;
