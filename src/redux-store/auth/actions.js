import types from '../types'
import backend from '../../api'


export const setUserData = (payload) => {
  return {
    type: types.SET_USER_DATA,
    payload,
  }
}

export const setAuthLoading = (payload) => {
  return {
    type: types.SET_AUTH_LOADING,
    payload,
  }
}

export const setAuthErrors = (payload) => {
  return {
    type: types.SET_AUTH_ERRORS,
    payload,
  }
}
export const setLoginErrors = (payload) => {
  return {
    type: types.SET_LOGIN_ERRORS,
    payload,
  }
}
export const setRegisterErrors = (payload) => {
  return {
    type: types.SET_REGISTER_ERRORS,
    payload,
  }
}
export const setPasswordChangeSuccess = (payload) => {
  return {
    type: types.SET_PASSWORD_CHANGE_SUCCESS,
    payload,
  }
}

export const setProfileExists = (payload) => {
  const user = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : null
  if (user) {
    user.profileExists = payload
    localStorage.setItem('user', JSON.stringify(user))
  }
  return {
    type: types.SET_PROFILE_EXISTS,
    payload,
  }
}

export const login = (email, password) => async (dispatch) => {

  try {
    dispatch(setAuthLoading(true))
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }
    const { data } = await backend.post('/api/user/login', { email, password }, config)
    console.log(data)
    dispatch(
      setUserData({
        ...data.data,
        token: data.token,
        profileExists: data.exists,
      })
    )

    localStorage.setItem(
      'user',
      JSON.stringify({
        ...data.data,
        token: data.token,
        profileExists: data.exists,
      })
    )

    return true;
  } catch (error) {
    console.log(error)
    dispatch(
      setLoginErrors(
        error?.response ? error.response.data.error : error.message
      )
    )
    return false;
  }
}

export const signUp = (email, password, fullname, mobileNumber) => async (dispatch) => {
  try {
    dispatch(setAuthLoading(true))
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const { data } = await backend.post(
      `/api/user`,
      { email, password, fullname, mobileNumber },
      config
    )

    // await dispatch(
    //   setUserData({
    //     ...data.data,
    //     token: data.token,
    //     profileExists: data.exists,
    //   })
    // )

    // localStorage.setItem(
    //   'user',
    //   JSON.stringify({
    //     ...data.data,
    //     token: data.token,
    //     profileExists: data.exists,
    //   })
    // )
    return true;
  } catch (error) {
    dispatch(setRegisterErrors(error?.response?.data.error))
    return false;
  }
}

export const logout = () => {
  localStorage.removeItem('user')
  return {
    type: types.USER_LOGOUT,
  }
  
}


