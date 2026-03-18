<?php

namespace App\Controllers\Api;

use App\Models\LocationModel;
use App\Models\RegionModel;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\RESTful\ResourceController;

class LocationController extends ResourceController
{
    use ResponseTrait;
    public function __construct() {}

    public function index()
    {
        $model = new LocationModel;

        $search = trim($this->request->getGet('search') ?? '');
        $builder = $model->select('location.id, location.location_name, location.address, location.type, region.region_name as region_name, location.region_id')
            ->join('region', 'region.id = location.region_id', 'left');

        if (!empty($search)) {
            $builder = $builder->groupStart()
                ->like('location.location_name', $search)
                ->orLike('location.address', $search)
                ->orLike('region.region_name', $search)
                ->groupEnd();
        }

        $data = $builder->paginate(10);

        return $this->respond(
            [
                "status" => 200,
                "data" => $data,
                "message" => "Success get location data",
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
        $model = new LocationModel;
        $location = $model->find($id);
        if (!$location) {
            return $this->failNotFound('Location not found');
        }
        return $this->respond(
            [
                "status" => 200,
                "data" => $location,
                "message" => "Success get location details",
            ]
        )->setStatusCode(ResponseInterface::HTTP_OK);
    }

    public function create()
    {
        helper('form');
        $rules = [
            'location_name' => 'required',
            'address'       => 'required',
            'type'          => 'required|in_list[hq,branch,mine]',
            'region_id'     => 'required',
        ];
        if (!$this->validate($rules)) {
            return $this->fail($this->validator->getErrors());
        }
        $model = new LocationModel;
        $data = [
            'location_name' => $this->request->getVar('location_name'),
            'address'       => $this->request->getVar('address'),
            'type'          => $this->request->getVar('type'),
            'region_id'     => $this->request->getVar('region_id'),
        ];
        $model->insert($data);
        return $this->respondCreated(
            [
                "status" => ResponseInterface::HTTP_CREATED,
                "message" => "Success create location",
            ]
        )->setStatusCode(ResponseInterface::HTTP_CREATED);
    }

    public function update($id = null)
    {
        helper('form');
        $rules = [
            'location_name' => 'required',
            'address'       => 'required',
            'type'          => 'required|in_list[hq,branch,mine]',
            'region_id'     => 'required',
        ];
        if (!$this->validate($rules)) {
            return $this->fail($this->validator->getErrors());
        }
        $model = new LocationModel;
        if (!$model->find($id)) {
            return $this->failNotFound('Location not found');
        }
        $data = [
            'location_name' => $this->request->getVar('location_name'),
            'address'       => $this->request->getVar('address'),
            'type'          => $this->request->getVar('type'),
            'region_id'     => $this->request->getVar('region_id'),
        ];
        $model->update($id, $data);
        return $this->respond(
            [
                "status" => ResponseInterface::HTTP_OK,
                "message" => "Success update location",
            ]
        )->setStatusCode(ResponseInterface::HTTP_OK);
    }

    public function delete($id = null)
    {
        $model = new LocationModel;
        if (!$model->find($id)) {
            return $this->failNotFound('Location not found');
        }
        $model->delete($id);
        return $this->respondDeleted(
            [
                "status" => ResponseInterface::HTTP_OK,
                "message" => "Success delete location",
            ]
        );
    }

    public function locationList()
    {
        $model = new LocationModel();
        $location = $model->select("id,location_name")->get()->getResult();
        return $this->respond($location);
    }
    public function regionList()
    {
        $model = new RegionModel();
        $region = $model->select("id,region_name")->get()->getResult();
        return $this->respond($region);
    }
}
