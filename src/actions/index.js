import alt from '../alt'
import Firebase from 'firebase'

class Actions {
  initSession () {
    return (dispatch) => {
      Firebase.auth().onAuthStateChanged(function (result) {
        let profile = null

        if (result) {
          profile = {
            id: result.uid,
            name: result.providerData[0].displayName,
            avatar: result.providerData[0].photoURL
          }
        }

        dispatch(profile)
      })
    }
  }
  login () {
    return (dispatch) => {
      let provider = new Firebase.auth.FacebookAuthProvider()
      provider.addScope('public_profile')
      Firebase.auth().signInWithPopup(provider).then(function (result) {
        let user = result.user

        let profile = {
          id: user.uid,
          name: user.providerData[0].displayName,
          avatar: user.providerData[0].photoURL
        }

        Firebase.database().ref('/users/'+user.uid).set(profile)
        dispatch(profile)

      }).catch(function (error) {
        console.log('Failed!', error)
      })
    }
  }

  logout () {
    return (dispatch) => {
      Firebase.auth().signOut().then(function () {
        // Sign-out successful.
        dispatch(null)
      }, function (error) {
        // An error happened.
        console.log(error)
      })
    }
  }

  getProducts() {
    return(dispatch) => {
      Firebase.database().ref('products').on('value', function(snapshot) {
        let products = snapshot.val();
        dispatch(products)
      })
    }
  }

  addProduct(product) {
    return (dispatch) => {
      Firebase.database().ref('products').push(product);
    }
  }
  
}

export default alt.createActions(Actions)
