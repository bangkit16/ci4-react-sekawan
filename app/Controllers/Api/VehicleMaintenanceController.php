<?php

namespace App\Controllers\Api;

use App\Models\VehicleMaintenanceModel;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\RESTful\ResourceController;

class VehicleMaintenanceController extends ResourceController
{
    use ResponseTrait;

    public function create()
    {
        $rules = [
            'vehicle_id' => 'required|numeric',
            'service_date' => 'required',
            'description' => 'required',
            'cost' => 'required|numeric',
            'next_service_date' => 'required',
        ];

        $data = $this->request->getJSON(true) ?? $this->request->getPost();
        if (!$this->validateData($data, $rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $model = new VehicleMaintenanceModel();
        
        $insertData = [
            'vehicle_id' => $data['vehicle_id'],
            'service_date' => $data['service_date'],
            'description' => $data['description'],
            'cost' => $data['cost'],
            'next_service_date' => $data['next_service_date'],
        ];

        $model->insert($insertData);

        return $this->respondCreated([
            "status" => 201,
            "message" => "Maintenance record created successfully",
        ]);
    }

    public function update($id = null)
    {
        $rules = [
            'service_date' => 'required',
            'description' => 'required',
            'cost' => 'required|numeric',
            'next_service_date' => 'required',
        ];

        $data = $this->request->getJSON(true) ?? $this->request->getRawInput();
        if (!$this->validateData($data, $rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $model = new VehicleMaintenanceModel();
        
        $updateData = [
            'service_date' => $data['service_date'],
            'description' => $data['description'],
            'cost' => $data['cost'],
            'next_service_date' => $data['next_service_date'],
        ];

        $model->update($id, $updateData);

        return $this->respond([
            "status" => 200,
            "message" => "Maintenance record updated successfully",
        ]);
    }

    public function delete($id = null)
    {
        $model = new VehicleMaintenanceModel();
        $record = $model->find($id);

        if ($record) {
            $model->delete($id);
            return $this->respondDeleted([
                "status" => 200,
                "message" => "Maintenance record deleted successfully",
            ]);
        }
        
        return $this->failNotFound('No Data Found');
    }
}
