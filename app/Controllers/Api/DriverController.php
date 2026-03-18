<?php

namespace App\Controllers\Api;

use App\Models\DriverModel;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\RESTful\ResourceController;

class DriverController extends ResourceController
{
    use ResponseTrait;
    public function __construct() {}

    public function index()
    {
        $model = new DriverModel;

        $search = trim($this->request->getGet('search') ?? '');
        $builder = $model->select('driver.id, driver.driver_name, driver.driver_phone');

        if (!empty($search)) {
            $builder = $builder->groupStart()->like('driver_name', $search)->orLike('driver_phone', $search)->groupEnd();
        }

        $data = $builder->paginate(10);

        return $this->respond(
            [
                "status" => 200,
                "data" => $data,
                "message" => "Success get driver data",
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
        $model = new DriverModel;
        $driver = $model->find($id);
        if (!$driver) {
            return $this->failNotFound('Driver not found');
        }
        return $this->respond(
            [
                "status" => 200,
                "data" => $driver,
                "message" => "Success get driver details",
            ]
        )->setStatusCode(ResponseInterface::HTTP_OK);
    }

    public function create()
    {
        helper('form');
        $rules = [
            'driver_name'  => 'required',
            'driver_phone' => 'required',
        ];
        if (!$this->validate($rules)) {
            return $this->fail($this->validator->getErrors());
        }
        $model = new DriverModel;
        $data = [
            'driver_name'  => $this->request->getVar('driver_name'),
            'driver_phone' => $this->request->getVar('driver_phone'),
        ];
        $model->insert($data);
        return $this->respondCreated(
            [
                "status" => ResponseInterface::HTTP_CREATED,
                "message" => "Success create driver",
            ]
        )->setStatusCode(ResponseInterface::HTTP_CREATED);
    }

    public function update($id = null)
    {
        helper('form');
        $rules = [
            'driver_name'  => 'required',
            'driver_phone' => 'required',
        ];
        if (!$this->validate($rules)) {
            return $this->fail($this->validator->getErrors());
        }
        $model = new DriverModel;
        if (!$model->find($id)) {
            return $this->failNotFound('Driver not found');
        }
        $data = [
            'driver_name'  => $this->request->getVar('driver_name'),
            'driver_phone' => $this->request->getVar('driver_phone'),
        ];
        $model->update($id, $data);
        return $this->respond(
            [
                "status" => ResponseInterface::HTTP_OK,
                "message" => "Success update driver",
            ]
        )->setStatusCode(ResponseInterface::HTTP_OK);
    }

    public function delete($id = null)
    {
        $model = new DriverModel;
        if (!$model->find($id)) {
            return $this->failNotFound('Driver not found');
        }
        $model->delete($id);
        return $this->respondDeleted(
            [
                "status" => ResponseInterface::HTTP_OK,
                "message" => "Success delete driver",
            ]
        );
    }
}
