import React from 'react'
import {
  View,
  ScrollView,
  ActivityIndicator,
  Image,
  RefreshControl,
} from 'react-native'
import api from 'src/utils/apiHOC'
import { MenuItem } from 'src/common'
import Jext from 'src/common/Jext'

@api({
  url: 'games',
  method: 'GET',
  name: 'games'
})
export default class Games extends React.Component {
  render() {
    const { data: { games, gamesLoading, gamesError, gamesRefetch }, userId, onGamePress } = this.props

    // if (gamesLoading || (!games && gamesLoading)) {
    //   return <ActivityIndicator />
    // }

    if (gamesError || (!games && !gamesLoading)) {
      return <Jext>{JSON.stringify(gamesError)}</Jext>
    }

    return (
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 80 }}
        refreshControl={<RefreshControl
          refreshing={gamesLoading}
          onRefresh={gamesRefetch}
        />}
      >
        {
          (games || []).map((game) => (
            <MenuItem
              key={game.id}
              title={`${game.players.find(p => !p.rack).user.fullName}${game.players.find(p => !!p.rack).shouldPlayNext ? '(نوبت تو) ':' (نوبت اون)'}`}
              rightIcon={<Image
                source={{ url: game.players.find(p => !p.rack).user.avatar }}
                style={{ width: 25, height: 25, borderRadius: 12.5 }}
              />}
              onPress={() => onGamePress(game)}
            />
          ))
        }

      </ScrollView>
    )
  }
}