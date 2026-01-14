/**
 * API utility for submitting forms to the PHP backend
 * 
 * In development (Lovable preview), these calls will fail gracefully.
 * In production (Dreamhost), they will work with the PHP endpoints.
 */

// Base URL for API - update this when deploying to Dreamhost
const API_BASE_URL = import.meta.env.PROD 
  ? '/api' 
  : 'https://cacfla.org/api';  // Update this to your Dreamhost URL

interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  request_id?: number;
  volunteer_id?: number;
  donation_id?: number;
}

/**
 * Submit a help request to the cacfriends database
 */
export async function submitHelpRequest(data: {
  service_type: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  service_details?: Record<string, string>;
}): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/help-request.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    return await response.json();
  } catch (error) {
    console.error('Help request submission error:', error);
    // In development, return a mock success response
    if (!import.meta.env.PROD) {
      console.log('Development mode: Mocking successful submission');
      return { 
        success: true, 
        message: 'Request submitted (development mode)',
        request_id: Date.now() 
      };
    }
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to submit request' 
    };
  }
}

/**
 * Submit a volunteer application to the cacvols database
 */
export async function submitVolunteerApplication(data: {
  name: string;
  email: string;
  phone?: string;
  service_area: string;
  availability: string[];
  experience?: string;
  message?: string;
}): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/volunteer.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    return await response.json();
  } catch (error) {
    console.error('Volunteer submission error:', error);
    // In development, return a mock success response
    if (!import.meta.env.PROD) {
      console.log('Development mode: Mocking successful submission');
      return { 
        success: true, 
        message: 'Application submitted (development mode)',
        volunteer_id: Date.now() 
      };
    }
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to submit application' 
    };
  }
}

/**
 * Submit a donation record to the cacvols database
 */
export async function submitDonation(data: {
  name?: string;
  email?: string;
  amount: string;
  payment_method: string;
}): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/donation.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    return await response.json();
  } catch (error) {
    console.error('Donation submission error:', error);
    // In development, return a mock success response
    if (!import.meta.env.PROD) {
      console.log('Development mode: Mocking successful submission');
      return { 
        success: true, 
        message: 'Donation recorded (development mode)',
        donation_id: Date.now() 
      };
    }
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to record donation' 
    };
  }
}
