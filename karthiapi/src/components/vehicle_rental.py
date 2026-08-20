from abc import ABC, abstractmethod


class Vehicle(ABC):
    def __init__(self, vehicle_number, brand, rental_price):
        self.vehicle_number = vehicle_number
        self.brand = brand
        self.rental_price = rental_price

    @abstractmethod
    def calculate_rental(self, days):
        pass

    @abstractmethod
    def display_details(self):
        pass


class Car(Vehicle):
    def __init__(self, vehicle_number, brand, rental_price, seats):
        super().__init__(vehicle_number, brand, rental_price)
        self.seats = seats

    def calculate_rental(self, days):
        amount = self.rental_price * days

        # 10% discount for rentals of 7 days or more
        if days >= 7:
            amount = amount * 0.90

        return amount

    def display_details(self):
        print("\n--- Car Details ---")
        print(f"Vehicle Number : {self.vehicle_number}")
        print(f"Brand          : {self.brand}")
        print(f"Seats          : {self.seats}")
        print(f"Rental Price   : ₹{self.rental_price}/day")


class Bike(Vehicle):
    def __init__(self, vehicle_number, brand, rental_price, engine_capacity):
        super().__init__(vehicle_number, brand, rental_price)
        self.engine_capacity = engine_capacity

    def calculate_rental(self, days):
        amount = self.rental_price * days

        # 5% discount for rentals of 7 days or more
        if days >= 7:
            amount = amount * 0.95

        return amount

    def display_details(self):
        print("\n--- Bike Details ---")
        print(f"Vehicle Number  : {self.vehicle_number}")
        print(f"Brand           : {self.brand}")
        print(f"Engine Capacity : {self.engine_capacity}cc")
        print(f"Rental Price    : ₹{self.rental_price}/day")


class RentalSystem:
    def __init__(self):
        self.vehicles = []

    def add_vehicle(self, vehicle):
        self.vehicles.append(vehicle)

    def show_vehicles(self):
        print("\n===== Available Vehicles =====")

        for vehicle in self.vehicles:
            vehicle.display_details()

    def calculate_rental(self, vehicle_number, days):
        for vehicle in self.vehicles:
            if vehicle.vehicle_number == vehicle_number:
                amount = vehicle.calculate_rental(days)

                print(f"\nRental Duration : {days} days")
                print(f"Total Rental    : ₹{amount:.2f}")

                return

        print("\nVehicle not found!")


# -----------------------------
# Main Program
# -----------------------------

rental_system = RentalSystem()

# Create vehicles
car = Car(
    "TN01AB1234",
    "Toyota",
    2000,
    5
)

bike = Bike(
    "TN02CD5678",
    "Yamaha",
    800,
    150
)

# Add vehicles
rental_system.add_vehicle(car)
rental_system.add_vehicle(bike)

# Display vehicles
rental_system.show_vehicles()

# Calculate rental amount
print("\n===== Rental Calculation =====")

rental_system.calculate_rental("TN01AB1234", 3)

rental_system.calculate_rental("TN02CD5678", 5)

rental_system.calculate_rental("TN01AB1234", 7)