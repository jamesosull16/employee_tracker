DROP DATABASE IF EXISTS employee_trackerDB;
CREATE DATABASE employee_trackerDB;
USE employee_trackerDB;
CREATE TABLE department (
  id INT PRIMARY KEY UNIQUE,
  name VARCHAR(30)
);
CREATE TABLE role (
  id INT PRIMARY KEY UNIQUE,
  title VARCHAR(30),
  salary DECIMAL(10, 2),
  department_id INT
);
CREATE TABLE employee (
  id INT PRIMARY KEY UNIQUE,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT,
  manager_id INT
);