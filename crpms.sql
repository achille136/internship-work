CREATE DATABASE IF NOT EXISTS CRPMS;
USE CRPMS;

CREATE TABLE Services (
  ServiceCode VARCHAR(20) PRIMARY KEY,
  ServiceName VARCHAR(100) NOT NULL,
  ServicePrice DECIMAL(12, 2) NOT NULL
);

CREATE TABLE Car (
  PlateNumber VARCHAR(20) PRIMARY KEY,
  Type VARCHAR(50) NOT NULL,
  Model VARCHAR(50) NOT NULL,
  ManufacturingYear INT NOT NULL,
  DriverPhone VARCHAR(20) NOT NULL,
  MechanicName VARCHAR(100) NOT NULL
);

CREATE TABLE ServiceRecord (
  RecordNumber INT AUTO_INCREMENT PRIMARY KEY,
  ServiceDate DATE NOT NULL,
  PlateNumber VARCHAR(20) NOT NULL,
  ServiceCode VARCHAR(20) NOT NULL,
  CONSTRAINT fk_record_car
    FOREIGN KEY (PlateNumber) REFERENCES Car (PlateNumber)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_record_service
    FOREIGN KEY (ServiceCode) REFERENCES Services (ServiceCode)
    ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE Payment (
  PaymentNumber INT AUTO_INCREMENT PRIMARY KEY,
  AmountPaid DECIMAL(12, 2) NOT NULL,
  PaymentDate DATE NOT NULL,
  RecordNumber INT NOT NULL,
  CONSTRAINT fk_payment_record
    FOREIGN KEY (RecordNumber) REFERENCES ServiceRecord (RecordNumber)
    ON UPDATE CASCADE ON DELETE RESTRICT
);

INSERT INTO Services (ServiceCode, ServiceName, ServicePrice) VALUES
  ('ENG01', 'Engine repair', 150000.00),
  ('TRN01', 'Transmission repair', 80000.00),
  ('OIL01', 'Oil Change', 60000.00),
  ('CHN01', 'Chain replacement', 40000.00),
  ('DSC01', 'Disc replacement', 400000.00),
  ('WHE01', 'Wheel alignment', 5000.00);
