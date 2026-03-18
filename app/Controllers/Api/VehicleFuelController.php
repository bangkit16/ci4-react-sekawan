<?php

namespace App\Controllers\Api;

use App\Models\VehicleFuelModel;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\RESTful\ResourceController;

class VehicleFuelController extends ResourceController
{
    use ResponseTrait;

    public function create()
    {
        $rules = [
            'vehicle_id' => 'required|numeric',
            'fuel_amount' => 'required|numeric',
            'fuel_price' => 'required|numeric',
            'fuel_date' => 'required',
        ];

        $data = $this->request->getJSON(true) ?? $this->request->getPost();
        if (!$this->validateData($data, $rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $model = new VehicleFuelModel();
        
        $insertData = [
            'vehicle_id' => $data['vehicle_id'],
            'fuel_amount' => $data['fuel_amount'],
            'fuel_price' => $data['fuel_price'],
            'fuel_date' => $data['fuel_date'],
        ];
        
        // booking_id might be needed but optional if not linked to booking here.
        if (isset($data['booking_id'])) {
            $insertData['booking_id'] = $data['booking_id'];
        }

        $model->insert($insertData);

        return $this->respondCreated([
            "status" => 201,
            "message" => "Fuel record created successfully",
        ]);
    }

    public function update($id = null)
    {
        $rules = [
            'fuel_amount' => 'required|numeric',
            'fuel_price' => 'required|numeric',
            'fuel_date' => 'required',
        ];

        $data = $this->request->getJSON(true) ?? $this->request->getRawInput();
        if (!$this->validateData($data, $rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $model = new VehicleFuelModel();
        
        $updateData = [
            'fuel_amount' => $data['fuel_amount'],
            'fuel_price' => $data['fuel_price'],
            'fuel_date' => $data['fuel_date'],
        ];

        $model->update($id, $updateData);

        return $this->respond([
            "status" => 200,
            "message" => "Fuel record updated successfully",
        ]);
    }

    public function delete($id = null)
    {
        $model = new VehicleFuelModel();
        $record = $model->find($id);

        if ($record) {
            $model->delete($id);
            return $this->respondDeleted([
                "status" => 200,
                "message" => "Fuel record deleted successfully",
            ]);
        }
        
        return $this->failNotFound('No Data Found');
    }
}
