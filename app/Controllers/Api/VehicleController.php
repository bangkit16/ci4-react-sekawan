<?php

namespace App\Controllers\Api;

use App\Models\LocationModel;
use App\Models\VehicleModel;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\RESTful\ResourceController;

class VehicleController extends ResourceController
{
    use ResponseTrait;
    public function __construct() {}


    public function index()
    {
        $model = new VehicleModel;

        $search = trim($this->request->getGet('search') ?? '');
        $status = trim($this->request->getGet('status') ?? '');
        $builder = $model->select(
            '
            vehicle.id,
            vehicle.vehicle_brand,
            vehicle.vehicle_ownership,
            vehicle.vehicle_number_plate,
            vehicle.vehicle_year,vehicle.vehicle_type,
            vehicle.vehicle_status,
            location.location_name'
        )->join('location', 'location.id = vehicle.vehicle_location');

        if (!empty($search)) {
            $builder = $builder->groupStart()->like('vehicle_brand', $search)->orLike('vehicle_number_plate', $search)->groupEnd();
        }

        if (!empty($status)) {
            $builder = $builder->where('vehicle_status', $status);
        }

        $data = $builder->paginate(10);
        $chip = [
            'all' => (new VehicleModel())->countAllResults(),
            'booked' => (new VehicleModel())->where('vehicle_status', 'booked')->countAllResults(),
            'available' => (new VehicleModel())->where('vehicle_status', 'available')->countAllResults(),
            'maintenance' => (new VehicleModel())->where('vehicle_status', 'maintenance')->countAllResults(),
        ];
        return $this->respond(
            [
                "status" => 200,
                "data" => $data,
                "message" => "Success get vehicle data",
                "chip" => $chip,
                "pager"    => [
                    "current_page" => $model->pager->getCurrentPage(),
                    "total_pages"  => $model->pager->getPageCount(),
                    "total_items"  => $model->pager->getTotal(),
                    "has_next"     => !empty($model->pager->getNextPageURI()),
                    "has_prev"     => !empty($model->pager->getPreviousPageURI()),
                    "get_first"    => $model->pager->getFirstPage(),
                    "get_last"     => $model->pager->getLastPage(),
                ],
            ]
        )->setStatusCode(ResponseInterface::HTTP_OK);
    }

    public function show($id = null)
    {
        $model = new VehicleModel;
        $vehicle = $model->select('vehicle.*, location.location_name')
            ->join('location', 'location.id = vehicle.vehicle_location', 'left')
            ->find($id);

        if (!$vehicle) {
            return $this->failNotFound('Vehicle not found');
        }

        // Fetch fuels
        $fuelModel = new \App\Models\VehicleFuelModel();
        $fuels = $fuelModel->where('vehicle_id', $id)->orderBy('fuel_date', 'DESC')->findAll();

        // Fetch usages
        $usageModel = new \App\Models\VehicleUsageHistoryModel();
        $usages = $usageModel->select('vehicle_usage_history.*, driver.driver_name')
            ->join('driver', 'driver.id = vehicle_usage_history.driver_id', 'left')
            ->where('vehicle_usage_history.vehicle_id', $id)
            ->orderBy('vehicle_usage_history.start_time', 'DESC')
            ->findAll();

        // Fetch maintenance
        $maintenanceModel = new \App\Models\VehicleMaintenanceModel();
        $maintenances = $maintenanceModel->where('vehicle_id', $id)->orderBy('service_date', 'DESC')->findAll();

        $vehicle['fuels'] = $fuels;
        $vehicle['usages'] = $usages;
        $vehicle['maintenances'] = $maintenances;

        return $this->respond(
            [
                "status" => 200,
                "data" => $vehicle,
                "message" => "Success get vehicle details",
            ]
        )->setStatusCode(ResponseInterface::HTTP_OK);
    }

    public function create()
    {
        helper('form');
        $rules = [
            'vehicle_brand' => 'required',
            'vehicle_ownership' => 'required|in_list[rent,owned]',
            'vehicle_number_plate' => 'required',
            'vehicle_year' => 'required|numeric',
            'vehicle_type' => 'required|in_list[goods,humans]',
            'vehicle_status' => 'required|in_list[available,booked,maintenance]',
            'vehicle_location' => 'required',
        ];
        if (!$this->validate($rules)) {
            return $this->fail($this->validator->getErrors());
        }
        $model = new VehicleModel;
        $data = [
            'vehicle_brand' => $this->request->getVar('vehicle_brand'),
            'vehicle_ownership' => $this->request->getVar('vehicle_ownership'),
            'vehicle_number_plate' => $this->request->getVar('vehicle_number_plate'),
            "vehicle_year" => $this->request->getVar('vehicle_year'),
            "vehicle_type" => $this->request->getVar('vehicle_type'),
            "vehicle_status" => $this->request->getVar('vehicle_status'),
            "vehicle_location" => $this->request->getVar('vehicle_location'),
        ];
        $vehicle = $model->insert($data);
        return $this->respondCreated(
            [
                "status" => ResponseInterface::HTTP_CREATED,
                "message" => "Success create vehicle",
            ]
        )->setStatusCode(ResponseInterface::HTTP_CREATED);
    }

    public function update($id = null)
    {
        helper('form');
        $rules = [
            'vehicle_brand' => 'required',
            'vehicle_ownership' => 'required|in_list[rent,owned]',
            'vehicle_number_plate' => 'required',
            'vehicle_year' => 'required|numeric',
            'vehicle_type' => 'required|in_list[goods,humans]',
            'vehicle_status' => 'required|in_list[available,booked,maintenance]',
            'vehicle_location' => 'required',
        ];
        if (!$this->validate($rules)) {
            return $this->fail($this->validator->getErrors());
        }
        $model = new VehicleModel;
        if (!$model->find($id)) {
            return $this->failNotFound('Vehicle not found');
        }
        $data = [
            'vehicle_brand' => $this->request->getVar('vehicle_brand'),
            'vehicle_ownership' => $this->request->getVar('vehicle_ownership'),
            'vehicle_number_plate' => $this->request->getVar('vehicle_number_plate'),
            "vehicle_year" => $this->request->getVar('vehicle_year'),
            "vehicle_type" => $this->request->getVar('vehicle_type'),
            "vehicle_status" => $this->request->getVar('vehicle_status'),
            "vehicle_location" => $this->request->getVar('vehicle_location'),
        ];
        $vehicle = $model->update($id, $data);
        return $this->respond(
            [
                "status" => ResponseInterface::HTTP_OK,
                "message" => "Success update vehicle",
            ]
        )->setStatusCode(ResponseInterface::HTTP_OK);
    }


    public function delete($id = null)
    {
        $model = new VehicleModel;
        if (!$model->find($id)) {
            return $this->failNotFound('Vehicle not found');
        }
        $model->delete($id);
        return $this->respondDeleted(
            [
                "status" => ResponseInterface::HTTP_OK,
                "message" => "Success delete vehicle",
            ]
        );
    }

    public function locationList(){
        $model = new LocationModel();
        
    }
}
