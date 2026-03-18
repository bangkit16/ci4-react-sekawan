<?php

namespace App\Controllers\Api;

use App\Models\VehicleBookingModel;
use App\Models\VehicleModel;
use App\Models\DriverModel;
use App\Models\EmployeeModel;
use App\Models\UserModel;
use App\Models\ApproveBookingModel;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\RESTful\ResourceController;

class BookingController extends ResourceController
{
    use ResponseTrait;

    public function index()
    {
        //
        $model = new VehicleBookingModel();

        // Get search and filter parameters
        $search = $this->request->getVar('search') ?? '';
        $status = $this->request->getVar('status') ?? '';
        $page = $this->request->getVar('page') ?? 1;

        $builder = $model->select(
            '
            vehicle_booking.id,
            vehicle.vehicle_brand,
            driver.driver_name,
            employee.employee_name,
            vehicle_booking.start_date,
            vehicle_booking.end_date,
            vehicle_booking.booking_status'

        )->join('vehicle', 'vehicle.id = vehicle_booking.vehicle_id')->join('driver', 'driver.id = vehicle_booking.driver_id')->join('employee', 'employee.id = vehicle_booking.requested_by_id');

        // Apply search filter
        if (!empty($search)) {
            $builder->groupStart()
                ->like('vehicle.vehicle_brand', $search)
                ->orLike('driver.driver_name', $search)
                ->orLike('employee.employee_name', $search)
                ->orLike('vehicle_booking.id', $search)
                ->groupEnd();
        }

        // Apply status filter
        if (!empty($status)) {
            $builder->where('vehicle_booking.booking_status', $status);
        }

        $data = $builder->paginate(10, 'default', $page);

        $chip = [
            'all' => (new VehicleBookingModel())->countAllResults(),
            'pending' => (new VehicleBookingModel())->where('booking_status', 'pending')->countAllResults(),
            'approve:level1' => (new VehicleBookingModel())->where('booking_status', 'approve:level1')->countAllResults(),
            'approve:level2' => (new VehicleBookingModel())->where('booking_status', 'approve:level2')->countAllResults(),
            'rejected:level1' => (new VehicleBookingModel())->where('booking_status', 'rejected:level1')->countAllResults(),
            'rejected:level2' => (new VehicleBookingModel())->where('booking_status', 'rejected:level2')->countAllResults(),
        ];

        return $this->respond(
            [
                "status" => 200,
                "data" => $data,
                "message" => "Success get booking data",
                "pager"    => [
                    "current_page" => $model->pager->getCurrentPage(),
                    "total_pages"  => $model->pager->getPageCount(),
                    "total_items"  => $model->pager->getTotal(),
                    "has_next"     => !empty($model->pager->getNextPageURI()),
                    "has_prev"     => !empty($model->pager->getPreviousPageURI()),
                    "get_first"    => $model->pager->getFirstPage(),
                    "get_last"     => $model->pager->getLastPage(),
                ],
                "chip" => $chip
            ]
        )->setStatusCode(ResponseInterface::HTTP_OK);
    }

    public function show($id = null)
    {
        //
    }

    /**
     * Get approval details for a booking
     */
    public function getApprovals($id = null)
    {
        if (!$id) {
            return $this->fail('Booking ID is required', ResponseInterface::HTTP_BAD_REQUEST);
        }

        $approvalModel = new ApproveBookingModel();

        $approvals = $approvalModel
            ->select('
                approve_booking.id,
                approve_booking.level,
                approve_booking.approval_status,
                approve_booking.approve_date,
                user.name as approver_name,
                user.email as approver_email
            ')
            ->join('user', 'user.id = approve_booking.approver_id')
            ->where('approve_booking.booking_id', $id)
            ->orderBy('approve_booking.level', 'ASC')
            ->findAll();

        if (empty($approvals)) {
            return $this->failNotFound('No approvals found for this booking');
        }

        return $this->respond([
            'status' => 200,
            'data' => $approvals,
            'message' => 'Success get approval details'
        ])->setStatusCode(ResponseInterface::HTTP_OK);
    }



    /**
     * Get list of vehicles
     */
    public function listVehicles()
    {
        $model = new VehicleModel();
        $vehicles = $model->select('id, vehicle_brand, vehicle_number_plate')->findAll();

        return $this->respond([
            'status' => 200,
            'data' => $vehicles,
            'message' => 'Success get vehicles'
        ])->setStatusCode(ResponseInterface::HTTP_OK);
    }

    /**
     * Get list of drivers
     */
    public function listDrivers()
    {
        $model = new DriverModel();
        $drivers = $model->select('id, driver_name, driver_phone')->findAll();

        return $this->respond([
            'status' => 200,
            'data' => $drivers,
            'message' => 'Success get drivers'
        ])->setStatusCode(ResponseInterface::HTTP_OK);
    }

    /**
     * Get list of employees
     */
    public function listEmployees()
    {
        $model = new EmployeeModel();
        $employees = $model->select('id, employee_name, employee_phone')->findAll();

        return $this->respond([
            'status' => 200,
            'data' => $employees,
            'message' => 'Success get employees'
        ])->setStatusCode(ResponseInterface::HTTP_OK);
    }

    /**
     * Get list of users (approvers)
     */
    public function listUsers()
    {
        $model = new UserModel();
        $users = $model->select('id, name, email, role')->findAll();

        return $this->respond([
            'status' => 200,
            'data' => $users,
            'message' => 'Success get users'
        ])->setStatusCode(ResponseInterface::HTTP_OK);
    }

    /**
     * Create a new resource object, from "posted" parameters.
     *
     * @return ResponseInterface
     */
    public function create()
    {
        // Validate request
        $rules = [
            'vehicle_id'     => 'required|numeric',
            'driver_id'      => 'required|numeric',
            'requested_by_id' => 'required|numeric',
            'start_date'     => 'required',
            'end_date'       => 'required',
            'approver_level_1' => 'required|numeric',
            'approver_level_2' => 'required|numeric',
        ];

        if (!$this->validate($rules)) {
            return $this->fail($this->validator->getErrors(), ResponseInterface::HTTP_BAD_REQUEST);
        }

        // Validate that approver 1 and 2 are different users
        $approver1 = $this->request->getVar('approver_level_1');
        $approver2 = $this->request->getVar('approver_level_2');

        if ($approver1 == $approver2) {
            return $this->fail(['approver_level_2' => 'Approver Level 2 must be different from Approver Level 1'], ResponseInterface::HTTP_BAD_REQUEST);
        }

        $bookingModel = new VehicleBookingModel();
        $approvalModel = new ApproveBookingModel();
        // $db = db_connect();

        // Convert datetime-local format (YYYY-MM-DDTHH:mm) to database format (Y-m-d H:i:s)
        $startDate = str_replace('T', ' ', $this->request->getVar('start_date')) . ':00';
        $endDate = str_replace('T', ' ', $this->request->getVar('end_date')) . ':00';

        // Start transaction
        // $db->transStart();

        try {
            // Create booking
            $bookingData = [
                'vehicle_id'     => $this->request->getVar('vehicle_id'),
                'driver_id'      => $this->request->getVar('driver_id'),
                'requested_by_id' => $this->request->getVar('requested_by_id'),
                'start_date'     => $startDate,
                'end_date'       => $endDate,
                'booking_status' => 'pending'
            ];

            if (!$bookingModel->insert($bookingData)) {
                throw new \Exception('Failed to create booking');
            }

            $bookingId = $bookingModel->insertID();

            // Create two approval records (level 1 and 2)
            $approvals = [
                [
                    'booking_id'      => $bookingId,
                    'approver_id'     => $this->request->getVar('approver_level_1'),
                    'level'           => 1,
                    'approve_date'    => date('Y-m-d H:i:s'),
                    'approval_status' => 'pending'
                ],
                [
                    'booking_id'      => $bookingId,
                    'approver_id'     => $this->request->getVar('approver_level_2'),
                    'approve_date'    => date('Y-m-d H:i:s'),
                    'level'           => 2,
                    'approval_status' => 'pending'
                ]
            ];

            if (!$approvalModel->insertBatch($approvals)) {
                throw new \Exception('Failed to create approvals');
            }

            // $db->transComplete();

            // if ($db->transStatus() === false) {
            //     return $this->fail('Transaction failed', ResponseInterface::HTTP_INTERNAL_SERVER_ERROR);
            // }

            return $this->respondCreated([
                'status' => 201,
                'data' => ['id' => $bookingId],
                'message' => 'Booking created successfully with 2 approval levels'
            ]);
        } catch (\Exception $e) {
            // $db->transRollback();
            return $this->fail($e->getMessage(), ResponseInterface::HTTP_INTERNAL_SERVER_ERROR);
        }
    }


    /**
     * Get pending approvals for the logged-in user
     */
    public function myApprovals()
    {
        // Get user ID from JWT token
        $authHeader = $this->request->getServer('HTTP_AUTHORIZATION');
        if (!$authHeader) {
            return $this->failUnauthorized('Unauthorized');
        }

        $token = str_replace('Bearer ', '', $authHeader);

        try {
            $decoded = \Firebase\JWT\JWT::decode($token, new \Firebase\JWT\Key(getenv('JWT_SECRET'), 'HS256'));
            $userId = $decoded->sub;
        } catch (\Exception $e) {
            return $this->failUnauthorized('Invalid token');
        }

        $approvalModel = new ApproveBookingModel();

        // Get pending approvals with booking and vehicle details
        $approvals = $approvalModel
            ->select('
                approve_booking.id,
                approve_booking.booking_id,
                approve_booking.level,
                approve_booking.approval_status,
                vehicle_booking.start_date,
                vehicle_booking.end_date,
                vehicle_booking.booking_status,
                vehicle.vehicle_brand,
                vehicle.vehicle_number_plate,
                driver.driver_name,
                employee.employee_name
            ')
            ->join('vehicle_booking', 'vehicle_booking.id = approve_booking.booking_id')
            ->join('vehicle', 'vehicle.id = vehicle_booking.vehicle_id')
            ->join('driver', 'driver.id = vehicle_booking.driver_id')
            ->join('employee', 'employee.id = vehicle_booking.requested_by_id')
            ->where('approve_booking.approver_id', $userId)
            ->where('approve_booking.approval_status', 'pending')
            ->orderBy('approve_booking.level', 'ASC')
            ->orderBy('vehicle_booking.start_date', 'ASC')
            ->findAll();

        return $this->respond([
            'status' => 200,
            'data' => $approvals,
            'message' => 'Success get pending approvals'
        ])->setStatusCode(ResponseInterface::HTTP_OK);
    }

    /**
     * Approve a booking
     */
    public function approve($id = null)
    {
        if (!$id) {
            return $this->fail('Approval ID is required', ResponseInterface::HTTP_BAD_REQUEST);
        }

        $approvalModel = new ApproveBookingModel();
        $approval = $approvalModel->find($id);

        if (!$approval) {
            return $this->failNotFound('Approval not found');
        }

        // Check if this is level 2 approval - verify level 1 has already been approved
        if ($approval['level'] == 2) {
            $level1Approval = $approvalModel
                ->where('booking_id', $approval['booking_id'])
                ->where('level', 1)
                ->first();

            if (!$level1Approval || $level1Approval['approval_status'] !== 'accepted') {
                return $this->fail('Level 1 approval must be accepted first', ResponseInterface::HTTP_BAD_REQUEST);
            }
        }

        // Update approval status
        $approvalModel->update($id, [
            'approval_status' => 'accepted',
            'approve_date' => date('Y-m-d H:i:s')
        ]);

        // Update booking status based on approval level
        $newBookingStatus = "approve:level" . $approval['level'];

        $db = db_connect();
        $db->table('vehicle_booking')
            ->where('id', $approval['booking_id'])
            ->update(['booking_status' => $newBookingStatus]);

        // If level 2 approves, set vehicle status to 'booked'
        if ($approval['level'] == 2) {
            $bookingModel = new VehicleBookingModel();
            $booking = $bookingModel->find($approval['booking_id']);

            if ($booking) {
                $vehicleModel = new VehicleModel();
                $vehicleModel->update($booking['vehicle_id'], ['vehicle_status' => 'booked']);
            }
        }

        return $this->respond([
            'status' => 200,
            'message' => 'Booking approved successfully',
            'booking_status' => $newBookingStatus
        ])->setStatusCode(ResponseInterface::HTTP_OK);
    }

    /**
     * Reject a booking
     */
    public function reject($id = null)
    {
        if (!$id) {
            return $this->fail('Approval ID is required', ResponseInterface::HTTP_BAD_REQUEST);
        }

        $rejectionReason = $this->request->getVar('reason');
        if (!$rejectionReason) {
            return $this->fail('Rejection reason is required', ResponseInterface::HTTP_BAD_REQUEST);
        }

        $approvalModel = new ApproveBookingModel();
        $approval = $approvalModel->find($id);

        if (!$approval) {
            return $this->failNotFound('Approval not found');
        }

        // Update approval status
        $approvalModel->update($id, [
            'approval_status' => 'rejected',
            'approve_date' => date('Y-m-d H:i:s')
        ]);

        // Update booking status based on approval level
        $newBookingStatus = "rejected:level" . $approval['level'];

        $db = db_connect();
        $db->table('vehicle_booking')
            ->where('id', $approval['booking_id'])
            ->update(['booking_status' => $newBookingStatus]);

        // If rejected, reset vehicle status back to 'available'
        $bookingModel = new VehicleBookingModel();
        $booking = $bookingModel->find($approval['booking_id']);

        if ($booking) {
            $vehicleModel = new VehicleModel();
            $vehicleModel->update($booking['vehicle_id'], ['vehicle_status' => 'available']);
        }

        return $this->respond([
            'status' => 200,
            'message' => 'Booking rejected successfully',
            'booking_status' => $newBookingStatus
        ])->setStatusCode(ResponseInterface::HTTP_OK);
    }

    /**
     * Add or update a model resource, from "posted" properties.
     *
     * @param int|string|null $id
     *
     * @return ResponseInterface
     */
    public function update($id = null)
    {
        //
    }

    /**
     * Delete the designated resource object from the model.
     *
     * @param int|string|null $id
     *
     * @return ResponseInterface
     */
    public function delete($id = null)
    {
        //
    }
}
