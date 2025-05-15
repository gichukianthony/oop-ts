/* --- 4. Ride sharing system with dynamic Pricing & Ratings
 Description: Create a full ride-sharing platform with user authentication, GPS location
 tracking, ride history, and driver/passenger matching logic. 
     --- Key Elements:
     1. User >>> parent for driver and passenger
    2. Ride >>> includes pickup.drop-off, fare calculation, ratings
    3. Dynamic Pricing Strategy >>> based on time of day, traffic
    4. Vehicle Management for drivers >>> vehicle details, availability
    5. Matching Algorithm >> nearest driver selection
---------------------------------------------------------------
        polymorphism in pricing strategy, encapsulation of rating and fare logic,strategy pattern for fare calculation,
        Factory Pattern for creating ride instances.
    this is a typscript implementation of OOP concepts
---------------------------------------------------------------
*/
const RideSystem = ()=>{
  //user base class
abstract class User {
  constructor(
    public id: string,
    public name: string,
    public location: { lat: number; lng: number }
  ) {}
}

// Driver extends User
class Driver extends User {
  vehicle: Vehicle;
  ratings: number[] = [];

  constructor(
    id: string,
    name: string,
    location: { lat: number; lng: number },
    vehicle: Vehicle
  ) {
    super(id, name, location);
    this.vehicle = vehicle;
  }

  getAverageRating(): number {
    if (this.ratings.length === 0) return 0;
    return this.ratings.reduce((a, b) => a + b, 0) / this.ratings.length;
  }
}

// Passenger extends User
class Passenger extends User {
  rideHistory: Ride[] = [];

  constructor(
    id: string,
    name: string,
    location: { lat: number; lng: number }
  ) {
    super(id, name, location);
  }
}

// Vehicle class
class Vehicle {
  constructor(
    public id: string,
    public make: string,
    public model: string,
    public capacity: number
  ) {}
}

//Fare Strategy (Polymorphism & Strategy Pattern)
interface FareStrategy {
  calculateFare(pickup: { lat: number; lng: number }, dropoff: { lat: number; lng: number }): number;
}

class BasicFareStrategy implements FareStrategy {
  calculateFare(
    pickup: { lat: number; lng: number },
    dropoff: { lat: number; lng: number }
  ): number {
    const distance = this.calculateDistance(pickup, dropoff);
    return distance * 50; // kes50 per unit distance
  }

  private calculateDistance(
    p1: { lat: number; lng: number },
    p2: { lat: number; lng: number }
  ): number {
    return Math.hypot(p2.lat - p1.lat, p2.lng - p1.lng);
  }
}

class TimeOfDayPricing implements FareStrategy {
  constructor(private baseStrategy: FareStrategy, private timeOfDay: string) {}

  calculateFare(
    pickup: { lat: number; lng: number },
    dropoff: { lat: number; lng: number }
  ): number {
    let fare = this.baseStrategy.calculateFare(pickup, dropoff);
    if (this.timeOfDay === 'peak') {
      fare *= 100; // 50% surge during peak hours
    }
    return fare;
  }
}

class TrafficBasedPricing implements FareStrategy {
  constructor(private baseStrategy: FareStrategy, private trafficLevel: number) {} // 0 to 1

  calculateFare(
    pickup: { lat: number; lng: number },
    dropoff: { lat: number; lng: number }
  ): number {
    let fare = this.baseStrategy.calculateFare(pickup, dropoff);
    fare *= 1 + this.trafficLevel * 0.5; // up to 50% increase
    return fare;
  }
}

// ======================= Ride & Factory Pattern =======================
class Ride {
  pickupLocation: { lat: number; lng: number };
  dropoffLocation: { lat: number; lng: number };
  rider: Passenger;
  driver?: Driver;
  fare: number;
  rating?: number;

  constructor(
    pickup: { lat: number; lng: number },
    dropoff: { lat: number; lng: number },
    rider: Passenger,
    fareCalculator: FareStrategy
  ) {
    this.pickupLocation = pickup;
    this.dropoffLocation = dropoff;
    this.rider = rider;
    this.fare = fareCalculator.calculateFare(pickup, dropoff);
  }

  assignDriver(driver: Driver) {
    this.driver = driver;
  }

  completeRide(rating: number) {
    this.rating = rating;
    if (this.driver) {
      this.driver.ratings.push(rating);
    }
    this.rider.rideHistory.push(this);
  }
}

class RideFactory {
  static createRide(
    pickup: { lat: number; lng: number },
    dropoff: { lat: number; lng: number },
    rider: Passenger,
    fareStrategy: FareStrategy
  ): Ride {
    return new Ride(pickup, dropoff, rider, fareStrategy);
  }
}

// ======================= Matching Algorithm =======================
class RideMatching {
  static findNearestDriver(
    passenger: Passenger,
    drivers: Driver[]
  ): Driver | null {
    if (drivers.length === 0) return null;
    return drivers.reduce((nearest, driver) => {
      const dist = Math.hypot(
        driver.location.lat - passenger.location.lat,
        driver.location.lng - passenger.location.lng
      );
      const nearestDist = nearest
        ? Math.hypot(
            nearest.location.lat - passenger.location.lat,
            nearest.location.lng - passenger.location.lng
          )
        : Infinity;
      return dist < nearestDist ? driver : nearest;
    }, null as Driver | null);
  }
}

// ======================= Example Usage =======================
// Setup drivers
const vehicle1 = new Vehicle('v1', 'Tesla', 'Model 3', 4);
const driver1 = new Driver(
  'd1',
  'Alice',
  { lat: 40.7128, lng: -74.0060 },
  vehicle1
);

const driver2 = new Driver(
  'd2',
  'Bob',
  { lat: 40.7120, lng: -74.0050 },
  new Vehicle('v2', 'BMW', 'X5', 4)
);

const drivers = [driver1, driver2];

// Setup passenger
const passenger = new Passenger('p1', 'Charlie', {
  lat: 40.7130,
  lng: -74.0070,
});

// Choose Fare Strategy
const baseStrategy = new BasicFareStrategy();
const timeStrategy = new TimeOfDayPricing(baseStrategy, 'peak');
const trafficStrategy = new TrafficBasedPricing(timeStrategy, 0.7); // heavy traffic

// Find nearest driver
const matchedDriver = RideMatching.findNearestDriver(passenger, drivers);

if (matchedDriver) {
  // Create ride
  const ride = RideFactory.createRide(
    passenger.location,
    { lat: 40.7300, lng: -74.0000 },
    passenger,
    trafficStrategy
  );

  // Assign driver to ride
  ride.assignDriver(matchedDriver);
  console.log(
    `Ride fare: ${ride.fare.toFixed(2)} with driver: ${matchedDriver.name}`
  );

  //output passener's price and destination
   console.log(`Passenger: ${passenger.name}`);
  console.log(`Destination: (${ride.dropoffLocation.lat}, ${ride.dropoffLocation.lng})`);
  console.log(`Price: ${ride.fare.toFixed(2)}`);

  // Complete the ride and rate it
  ride.completeRide(5); // passenger rates 5 stars

  console.log(
    `Driver's average rating: ${matchedDriver.getAverageRating().toFixed(2)}`
  );
} else {
  console.log('No drivers available nearby.');
}
}

export default RideSystem;