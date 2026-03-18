<?php

namespace App\Controllers\Api;

use App\Models\VehicleUsageHistoryModel;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\RESTful\ResourceController;

class VehicleUsageHistoryController extends ResourceController
{
    use ResponseTrait;

    public function create()
    {
        $rules = [
            'vehicle_id' => 'required|numeric',
            'driver_id' => 'required|numeric',
            'distance' => 'required|numeric',
            'start_time' => 'required',
        ];

        $data = $this->request->getJSON(true) ?? $this->request->getPost();
        if (!$this->validateData($data, $rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $model = new VehicleUsageHistoryModel();
        
        $insertData = [
            'vehicle_id' => $data['vehicle_id'],
            'driver_id' => $data['driver_id'],
            'distance' => $data['distance'],
            'start_time' => $data['start_time'],
        ];

        if (isset($data['booking_id'])) {
            $insertData['booking_id'] = $data['booking_id'];
        }

        if (isset($data['end_time']) && !empty($data['end_time'])) {
            $insertData['end_time'] = $data['end_time'];
        }

        $model->insert($insertData);

        return $this->respondCreated([
            "status" => 201,
            "message" => "Usage history record created successfully",
        ]);
    }

    public function update($id = null)
    {
        $rules = [
            'driver_id' => 'required|numeric',
            'distance' => 'required|numeric',
            'start_time' => 'required',
        ];

        $data = $this->request->getJSON(true) ?? $this->request->getRawInput();
        if (!$this->validateData($data, $rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $model = new VehicleUsageHistoryModel();
        
        $updateData = [
            'driver_id' => $data['driver_id'],
            'distance' => $data['distance'],
            'start_time' => $data['start_time'],
        ];

        if (isset($data['end_time']) && !empty($data['end_time'])) {
            $updateData['end_time'] = $data['end_time'];
        }

        $model->update($id, $updateData);

        return $this->respond([
            "status" => 200,
            "message" => "Usage record updated successfully",
        ]);
    }

    public function delete($id = null)
    {
        $model = new VehicleUsageHistoryModel();
        $record = $model->find($id);

        if ($record) {
            $model->delete($id);
            return $this->respondDeleted([
                "status" => 200,
                "message" => "Usage record deleted successfully",
            ]);
        }
        
        return $this->failNotFound('No Data Found');
    }
}
