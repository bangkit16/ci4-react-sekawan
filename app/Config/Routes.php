<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
// $routes->get('/', 'Home::index');

$routes->group('api', ['filter' => 'jwt'], function ($routes) {
    // Custom booking list endpoints BEFORE resource routes
    $routes->get('booking/list-vehicles', 'Api\BookingController::listVehicles');
    $routes->get('booking/list-drivers', 'Api\BookingController::listDrivers');
    $routes->get('booking/list-employees', 'Api\BookingController::listEmployees');
    $routes->get('booking/list-users', 'Api\BookingController::listUsers');
    $routes->get('booking/my-approvals', 'Api\BookingController::myApprovals');
    $routes->get('booking/(:num)/approvals', 'Api\BookingController::getApprovals/$1');
    $routes->get('dashboard', 'Api\DashboardController::index');
    $routes->post('booking/(:num)/approve', 'Api\BookingController::approve/$1');
    $routes->post('booking/(:num)/reject', 'Api\BookingController::reject/$1');

    // Resource routes
    $routes->resource('vehicle', [
        'controller' => 'Api\VehicleController'
    ]);
    $routes->resource('driver', [
        'controller' => 'Api\DriverController'
    ]);
    $routes->resource('employee', [
        'controller' => 'Api\EmployeeController'
    ]);
    $routes->resource('location', [
        'controller' => 'Api\LocationController'
    ]);
    $routes->resource('booking', [
        'controller' => 'Api\BookingController'
    ]);
    $routes->resource('vehicle-fuel', [
        'controller' => 'Api\VehicleFuelController'
    ]);
    $routes->resource('vehicle-usage', [
        'controller' => 'Api\VehicleUsageHistoryController'
    ]);
    $routes->resource('vehicle-maintenance', [
        'controller' => 'Api\VehicleMaintenanceController'
    ]);
    $routes->get('listlocation', 'Api\LocationController::locationList');
    $routes->get('listregion', 'Api\LocationController::regionList');
    // $routes->get('listvehicle', 'Api\VehicleController::vehicleList');
    // $routes->get('listdriver', 'Api\DriverController::driverList');
    // $routes->get('listemployee', 'Api\EmployeeController::employeeList');
});

$routes->group('api/auth', function ($routes) {
    $routes->post('login', 'Api\AuthController::login');
    $routes->post('logout', 'Api\AuthController::logout', ['filter' => 'jwt']);
    $routes->post('refresh', 'Api\AuthController::refresh'); // Refresh reads the HttpOnly cookie
    $routes->get('me', 'Api\AuthController::me', ['filter' => 'jwt']);  // ✅ Changed to GET
});
