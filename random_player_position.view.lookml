
view: pitch_example {
  derived_table: {
    sql: WITH player_data AS (
        SELECT
          -- Assign the first 11 players to 'Team A' and the rest to 'Team B'
          CASE
            WHEN player_id <= 11 THEN 'Team A'
            ELSE 'Team B'
          END AS team_name,
      
          -- Generate a random X coordinate within the pitch dimensions (0 to 105)
          RAND() * 105 AS x_coordinate,
      
          -- Generate a random Y coordinate within the pitch dimensions (0 to 68)
          RAND() * 68 AS y_coordinate
      
        FROM
          -- This is the BigQuery way to generate 22 rows from nothing
          UNNEST(GENERATE_ARRAY(1, 22)) AS player_id
      )
      
      SELECT
        x_coordinate,
        y_coordinate,
        team_name
      FROM player_data ;;
  }

  measure: count {
    type: count
    drill_fields: [detail*]
  }

  dimension: x_coordinate {
    type: number
    sql: ${TABLE}.x_coordinate ;;
  }

  dimension: y_coordinate {
    type: number
    sql: ${TABLE}.y_coordinate ;;
  }

  dimension: team_name {
    type: string
    sql: ${TABLE}.team_name ;;
  }

  set: detail {
    fields: [
        x_coordinate,
	y_coordinate,
	team_name
    ]
  }
}
