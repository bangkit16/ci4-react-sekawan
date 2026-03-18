<?php

namespace App\Controllers\Api;

use App\Models\EmployeeModel;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\RESTful\ResourceController;

class EmployeeController extends ResourceController
{
    use ResponseTrait;
    public function __construct() {}

    public function index()
    {
        $model = new EmployeeModel;

        $search = trim($this->request->getGet('search') ?? '');
        $builder = $model->select('employee.id, employee.employee_name, employee.employee_phone');

        if (!empty($search)) {
            $builder = $builder->groupStart()->like('employee_name', $search)->orLike('employee_phone', $search)->groupEnd();
        }

        $data = $builder->paginate(10);

        return $this->respond(
            [
                "status" => 200,
                "data" => $data,
                "message" => "Success get employee data",
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
        $model = new EmployeeModel;
        $employee = $model->find($id);
        if (!$employee) {
            return $this->failNotFound('Employee not found');
        }
        return $this->respond(
            [
                "status" => 200,
                "data" => $employee,
                "message" => "Success get employee details",
            ]
        )->setStatusCode(ResponseInterface::HTTP_OK);
    }

    public function create()
    {
        helper('form');
        $rules = [
            'employee_name'     => 'required',
            'employee_phone'    => 'required',
        ];
        if (!$this->validate($rules)) {
            return $this->fail($this->validator->getErrors());
        }
        $model = new EmployeeModel;
        $data = [
            'employee_name'     => $this->request->getVar('employee_name'),
            'employee_phone'    => $this->request->getVar('employee_phone'),
        ];
        $model->insert($data);
        return $this->respondCreated(
            [
                "status" => ResponseInterface::HTTP_CREATED,
                "message" => "Success create employee",
            ]
        )->setStatusCode(ResponseInterface::HTTP_CREATED);
    }

    public function update($id = null)
    {
        helper('form');
        $rules = [
            'employee_name'     => 'required',
            'employee_phone'    => 'required',
        ];
        if (!$this->validate($rules)) {
            return $this->fail($this->validator->getErrors());
        }
        $model = new EmployeeModel;
        if (!$model->find($id)) {
            return $this->failNotFound('Employee not found');
        }
        $data = [
            'employee_name'     => $this->request->getVar('employee_name'),
            'employee_phone'    => $this->request->getVar('employee_phone'),
        ];
        $model->update($id, $data);
        return $this->respond(
            [
                "status" => ResponseInterface::HTTP_OK,
                "message" => "Success update employee",
            ]
        )->setStatusCode(ResponseInterface::HTTP_OK);
    }

    public function delete($id = null)
    {
        $model = new EmployeeModel;
        if (!$model->find($id)) {
            return $this->failNotFound('Employee not found');
        }
        $model->delete($id);
        return $this->respondDeleted(
            [
                "status" => ResponseInterface::HTTP_OK,
                "message" => "Success delete employee",
            ]
        );
    }
}
